from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from youtubesearchpython import Playlist
from elasticsearch import Elasticsearch
import json
import requests


index_name = 'this_little_corner'


def delete_index(es_object):
    es_object.indices.delete(index=index_name)


def connect_elasticsearch():
    _es = Elasticsearch([{'host': 'localhost', 'port': 9200}], timeout=5)
    if _es.ping():
        print('elasticsearch is connected')
        return _es
    else:
        print('could not connect to elasticsearch')
        return None


if __name__ == '__main__':
    es = connect_elasticsearch()
    if es is not None:
        delete_index(es)