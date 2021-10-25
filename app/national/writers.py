import csv
from django.http import StreamingHttpResponse

class Echo(object):
    def write(self, value):
        return value

def iter_items(items, pseudo_buffer, headers):
    writer = csv.writer(pseudo_buffer)
    yield writer.writerow(headers)

    for item in items:
        yield writer.writerow(item)

def get_streaming_response(queryset, fields):
    response = StreamingHttpResponse(streaming_content=(iter_items(queryset, Echo(), fields)),
                                     content_type='text/csv')
    return response
