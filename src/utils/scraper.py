from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from youtubesearchpython import Playlist
from elasticsearch import Elasticsearch
import json
import requests
import os

insecure_prod_hashtag_yolo = 'http://this-little-corner.com:80/indexer' # todo security i guess
domain = os.getenv('ES_HOST')
port = os.getenv('ES_PORT')
username = os.getenv('ES_USERNAME')
password = os.getenv('ES_PASSWORD')
cert = os.getenv('ES_TLS_CRT')
yt_api_key = os.getenv('YOUTUBE_API_KEY')

if not domain and not port:
    domain = 'this-little-corner-elastic.ngrok.io'
    port = 80


def get_video_details(key, video_id):

    headers = {
        'Accept': 'application/json',
    }

    params = (
        ('part', 'snippet'),
        ('id', video_id),
        ('key', key),
    )

    response = requests.get('https://youtube.googleapis.com/youtube/v3/videos', headers=headers, params=params)
    content = json.loads(response.content)
    if 'items' not in content:
        print('invalid response: will not index')
    return content['items'][0]['snippet']



index_name = 'this_little_corner'


def create_index(es_object):
    created = False
    # index settings
    settings = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "dynamic": "strict",
            "properties": {
                "video_id": {"type": "text"},
                "channel_id": {"type": "text"},
                "channel_name": {"type": "text"},
                "title": {"type": "text"},
                "url": {"type": "text"},
                "date": {"type": "date"},
                "description": {"type": "text"},
                "duration": {"type": "integer"},
                "transcript_full": {"type": "text"},
                "transcript_parts": {
                    "properties": {
                        "text": {"type": "text"},
                        "start": {"type": "float"},
                        "duration": {"type": "float"}
                    }
                },
            }
        }
    }

    try:
        if not es_object.indices.exists(index=index_name):
            # Ignore 400 means to ignore "Index Already Exist" error.
            result = es_object.indices.create(index=index_name, ignore=400, body=settings)
            print('Created Index: ' + json.dumps(result))
        created = True
    except Exception as ex:
        print(str(ex))
    finally:
        return created


def store_record(elastic_object, video_id, record):
    is_stored = True
    try:
        outcome = elastic_object.index(index=index_name, id=video_id, document=record)
    except Exception as ex:
        print('Error in indexing data')
        print(str(ex))
        is_stored = False
    finally:
        return is_stored


def already_exists(elastic_object, video_id):
    resp = elastic_object.search(index=index_name, query={
            'match': {
                'video_id': video_id,
            }
    })
    if resp['hits']['total']['value'] > 0:
        return True
    return False


def connect_elasticsearch():
    if domain and port and cert and username and password:
        _es = Elasticsearch([{'host': domain, 'port': int(port), 'scheme': 'https'}], ca_certs=cert, request_timeout=5, basic_auth=(username, password))
    else:
        _es = Elasticsearch([insecure_prod_hashtag_yolo], timeout=5)
    if _es.ping():
        print('elasticsearch is connected')
        return _es
    else:
        print('could not connect to elasticsearch')
        return None


def get_transcript(video_id):
    try:
        return YouTubeTranscriptApi.get_transcript(video_id)
    except (TranscriptsDisabled, NoTranscriptFound):
        return []


def convert_to_seconds(time_string):
    parts = time_string.split(':')
    parts.reverse()
    seconds = 0
    multiplier = 1
    for part in parts:
        seconds += int(part) * multiplier
        multiplier *= 60
    return seconds


def index_channel(elastic, name, channel_id):
    print('Indexing ' + name)

    if yt_api_key is None:
        text_file = open("secrets.txt", "r")
        youtube_api_key = text_file.read()
        text_file.close()
    else:
        youtube_api_key = yt_api_key

    # get all the videos for the channel
    playlist = Playlist(f'https://www.youtube.com/playlist?list=UU{channel_id[2:]}')
    while playlist.hasMoreVideos:
        print(f'Videos Retrieved: {len(playlist.videos)}')
        playlist.getNextVideos()
        break  # only need to get all videos the first time indexing a channel
    print('Found all the videos.')

    n = 0
    already_indexed_in_a_row = 0
    for video in playlist.videos:
        n += 1
        video_id = video['id']
        video_title = video['title']

        if already_exists(es, video_id):
            already_indexed_in_a_row += 1
            if already_indexed_in_a_row >= 5:
                print(f'Probably the rest will already be indexed. Moving on...')
                break
            print(f'Already indexed video {n} of {len(playlist.videos)} ({video_title})')
            continue

        already_indexed_in_a_row = 0

        try:
            video_url = video['link'].split('&')[0]
            video_seconds = convert_to_seconds(video['duration'])
            more_details = get_video_details(youtube_api_key, video_id)
            video_description = more_details['description']
            video_date = more_details['publishedAt'].split('T')[0]
            transcript_parts = get_transcript(video_id)
            transcript_full_string = ' '.join([x['text'] for x in transcript_parts])

            to_index = {
                'video_id': video_id,
                'channel_id': channel_id,
                'channel_name': video['channel']['name'],
                'title': video_title,
                'url': video_url,
                'date': video_date,
                'description': video_description,
                'duration': video_seconds,
                'transcript_full': transcript_full_string,
                'transcript_parts': transcript_parts
            }
            to_index_json = json.dumps(to_index)

            store_record(elastic, video_id, to_index_json)
            print(f'Indexed video {n} of {len(playlist.videos)} ({video_title})')
        except Exception as e:
            print(f'Error indexing video {n} of {len(playlist.videos)} ({video_title}): ')


if __name__ == '__main__':
    es = connect_elasticsearch()
    if es is not None:
        create_index(es)
        index_channel(es, 'The Common Toad', 'UC-QiBn6GsM3JZJAeAQpaGAA')
        index_channel(es, 'A Quality Existence', 'UC6vg0HkKKlgsWk-3HfV-vnw')
        index_channel(es, 'Grizwald Grim', 'UCAqTQ5yLHHH44XWwWXLkvHQ')
        index_channel(es, 'Colton Kirby', 'UC6Tvr9mBXNaAxLGRA_sUSRA')
        index_channel(es, 'The Andromist', 'UCIAtCuzdvgNJvSYILnHtdWA')
        index_channel(es, 'Bridges of Meaning Hub', 'UCiJmdXTb76i8eIPXdJyf8ZQ')
        index_channel(es, 'Michael Sartori', 'UC8SErJkYnDsYGh1HxoZkl-g')
        index_channel(es, 'The Information Addict', 'UCM9Z05vuQhMEwsV03u6DrLA')
        index_channel(es, 'Mary Kochan', 'UC2leFZRD0ZlQDQxpR2Zd8oA')
        index_channel(es, 'Grail Country', 'UCsi_x8c12NW9FR7LL01QXKA')
        index_channel(es, 'Paul Anleitner', 'UC2yCyOMUeem-cYwliC-tLJg')
        index_channel(es, 'Jacob', 'UCprytROeCztMOMe8plyJRMg')
        index_channel(es, 'Chad the Alcoholic', 'UCuex29iuR-bNNMZZXTw4JpQ')
        index_channel(es, 'The Chris Show', 'UClIDP7_Kzv_7tDQjTv9EhrA')
        index_channel(es, 'Andrea with the Bangs', 'UCeWWxwzgLYUbfjWowXhVdYw')
        index_channel(es, 'Rebel Wisdom', 'UCFQ6Gptuq-sLflbJ4YY3Umw')
        index_channel(es, 'Transfigured', 'UCg7Ed0lecvko58ibuX1XHng')
        index_channel(es, 'Paul VanderKlay', 'UCGsDIP_K6J6VSTqlq-9IPlg')
        index_channel(es, 'Randos United', 'UCEzWTLDYmL8soRdQec9Fsjw')
        index_channel(es, 'The Meaning Code', 'UCgp_r6WlBwDSJrP43Mz07GQ')
        index_channel(es, 'The Symbolic World', 'UCtCTSf3UwRU14nYWr_xm-dQ')
        index_channel(es, 'John Vervaeke', 'UCpqDUjTsof-kTNpnyWper_Q')
        index_channel(es, 'Jordan Peterson', 'UCL_f53ZEJxp8TtlOkHwMV9Q')
