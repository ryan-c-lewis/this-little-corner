from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from youtubesearchpython import Playlist
from elasticsearch import Elasticsearch
import json
import requests


index_name = 'this_little_corner'
doc_type = 'videos'


def create_index(es_object):
    created = False
    # index settings
    settings = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "videos": {
                "dynamic": "strict",
                "properties": {
                    "id": {"type": "text"},
                    "channel_id": {"type": "text"},
                    "title": {"type": "text"},
                    "url": {"type": "text"},
                    "date": {"type": "date"},
                    "description": {"type": "text"},
                    "duration": {"type": "integer"},
                    "transcript_full": {"type": "text"},
                    "transcript_parts": {
                        "type": "nested",
                        "index": False,
                        "properties": {
                            "text": {"type": "text"},
                            "start": {"type": "float"},
                            "duration": {"type": "float"}
                        }
                    },
                }
            }
        }
    }

    try:
        if not es_object.indices.exists(index_name):
            # Ignore 400 means to ignore "Index Already Exist" error.
            es_object.indices.create(index=index_name, ignore=400, body=settings)
            print('Created Index')
        created = True
    except Exception as ex:
        print(str(ex))
    finally:
        return created


def store_record(elastic_object, record):
    is_stored = True
    try:
        outcome = elastic_object.index(index=index_name, doc_type=doc_type, document=record)
        print(outcome)
    except Exception as ex:
        print('Error in indexing data')
        print(str(ex))
        is_stored = False
    finally:
        return is_stored


def connect_elasticsearch():
    _es = Elasticsearch([{'host': 'localhost', 'port': 9200}], timeout=5)
    if _es.ping():
        print('elasticsearch is connected')
        return _es
    else:
        print('could not connect to elasticsearch')
        return None


def get_video_details(url):
    headers = {"Accept-Language": "en-US,en;q=0.5"}
    html = requests.get(url, headers=headers).text
    json_string = html.split('var ytInitialPlayerResponse = ')[1].split(';</script>')[0]
    return json.loads(json_string)['microformat']['playerMicroformatRenderer']


def get_transcript(video_id):
    try:
        return YouTubeTranscriptApi.get_transcript(video_id)
    except (TranscriptsDisabled, NoTranscriptFound):
        print('No transcript for ' + video_id)
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

    # get all the videos for the channel
    playlist = Playlist(f'https://www.youtube.com/playlist?list=UU{channel_id[2:]}')
    while playlist.hasMoreVideos:
        print(f'Videos Retrieved: {len(playlist.videos)}')
        playlist.getNextVideos()
    print('Found all the videos.')

    n = 0
    for video in playlist.videos:
        n += 1
        video_id = video['id']
        video_title = video['title']
        video_url = video['link'].split('&')[0]
        video_seconds = convert_to_seconds(video['duration'])
        more_details = get_video_details(video_url)
        video_description = None
        if more_details.get('description') is not None:
            video_description = more_details['description']['simpleText']
        video_date = more_details['publishDate']
        transcript_parts = get_transcript(video_id)
        transcript_full_string = ' '.join([x['text'] for x in transcript_parts])

        to_index = {
            'id': video_id,
            'channel_id': channel_id,
            'title': video_title,
            'url': video_url,
            'date': video_date,
            'description': video_description,
            'duration': video_seconds,
            'transcript_full': transcript_full_string,
            'transcript_parts': transcript_parts
        }
        to_index_json = json.dumps(to_index)

        store_record(elastic, to_index_json)
        print(f'Indexed video {n} of {len(playlist.videos)} ({video_title})')


if __name__ == '__main__':
    es = connect_elasticsearch()
    if es is not None:
        index_channel(es, 'Paul Vander Klay', 'UCGsDIP_K6J6VSTqlq-9IPlg')