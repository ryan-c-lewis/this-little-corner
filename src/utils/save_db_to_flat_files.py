import os

from elasticsearch import Elasticsearch
import json


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


# https://techoverflow.net/2019/05/03/elasticsearch-how-to-iterate-all-documents-in-index-using-python-up-to-10000-documents/
def es_iterate_all_documents(elastic_object, index, pagesize=250, **kwargs):
    offset = 0
    while True:
        result = elastic_object.search(index=index, **kwargs, body={
            "size": pagesize,
            "from": offset
        })
        hits = result["hits"]["hits"]
        if not hits:
            break
        yield from (hit['_source'] for hit in hits)
        offset += pagesize


def save_all_documents(elastic):
    for doc in es_iterate_all_documents(elastic, index_name):
        doc.pop('transcript_full', None)
        doc_as_json = json.dumps(doc, indent=1)
        file_path = '../data/video_metadata/' + doc['channel_id'] + '/' + doc['video_id'] + '.json'
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as file:
            file.write(doc_as_json)
        print('wrote to file ' + doc['title'])


if __name__ == '__main__':
    es = connect_elasticsearch()
    if es is not None:
        save_all_documents(es)
