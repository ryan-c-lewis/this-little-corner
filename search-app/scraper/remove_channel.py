import time

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from youtubesearchpython import Playlist
from elasticsearch import Elasticsearch
import json
import requests


domain = 'this-little-corner-elastic.ngrok.io'
port = 80


index_name = 'this_little_corner'


def connect_elasticsearch():
    _es = Elasticsearch([{'host': domain, 'port': port}], timeout=5)
    if _es.ping():
        print('elasticsearch is connected')
        return _es
    else:
        print('could not connect to elasticsearch')
        return None


def get_some_videos_for_channel(elastic_object, channel_id):
    resp = elastic_object.search(index=index_name, size=100, query={
        'match': {
            'channel_id': channel_id,
        }
    })
    return resp['hits']


def delete_video(elastic_object, video_id):
    resp = elastic_object.delete(index=index_name, id=video_id)


def remove_channel(elastic, name, channel_id):
    print('Removing ' + name)

    while True:
        videos = get_some_videos_for_channel(elastic, channel_id)
        videos_remaining = videos['total']['value']
        print('Videos remaining: ' + str(videos_remaining))
        if videos['total']['value'] > 0:
            for hit in videos['hits']:
                video_id = hit['_source']['video_id']
                delete_video(elastic, video_id)
                print('Deleted ' + video_id)
        else:
            return
        time.sleep(1)


if __name__ == '__main__':
    es = connect_elasticsearch()
    if es is not None:
        remove_channel(es, 'Ancient Faith', 'UCOA_vxLRZ3-PWpFBdHR-AyA')