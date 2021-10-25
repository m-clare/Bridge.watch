from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.db.models import F
from .writers import get_streaming_response
from django_pandas.io import read_frame
from django.http import HttpResponse
# Create your views here.

@api_view(["GET"])
def national_bridges_csv(request):

    if request.method == "GET":
        # base query
        fields = []
        bridges = Bridge.objects.all()

        # todo: more general way of retrieving query params?
        # store as dictionary, then parse into:
        # base plot type
        # boolean params (columns to include)
        # filter params (lists or single values?)

        # base type of plot
        # rating base
        plot_type = request.query_params.get("plot_type")
        if plot_type == "rating":
            bridges = bridges.exclude(lowest_rating_id__isnull=True)
            fields.append(plot_type)
        # year built base
        elif plot_type == "year_built":
            bridges = bridges.exclude(year_built__isnull=True)
            fields.append(plot_type)
        else:
            raise ValueError("invalid plot type provided")

        # material type
        material = request.query_params.get("material")
        if material is not None:
            material_list = material.split(',')
            bridges = bridges.filter(structure_kind__code__in=material_list)
        # bridge type
        type = request.query_params.get("type")
        if type is not None:
            type_list = type.split(',')
            bridges = bridges.filter(structure_type__code__in=type_list)
        # bridge service
        service = request.query_params.get("service")
        if service is not None:
            service_list = service.split(',')
            bridges = bridges.filter(type_of_service_on_bridge__code__in=service_list)

        fields.extend(["latitude", "longitude"])
        if ('rating' in fields):
            bridges = bridges.annotate(rating=F('lowest_rating__code'))
        bridges = bridges.values_list(*fields)

        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if (limit != None):
            num_limit = int(limit)
            bridges = bridges[:num_limit]

        # df = read_frame(bridges, fieldnames=fields)
        # response = HttpResponse(content_type='text/csv')
        # df.to_csv(path_or_buf=response, index=False)
        # return response

        return get_streaming_response(bridges, fields)
    else:
        return Response("", status=status.HTTP_400_BAD_REQUEST)
