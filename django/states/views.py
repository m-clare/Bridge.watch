from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Bridge
from .models import LowestRating
from .models import *
from .serializers import *

# Create your views here.
def index(request):
    return HttpResponse("You're at the NBI index.")


# exclude Tunnel=18, Culvert=19, Other=00
bridges_only = (
    Bridge.objects.exclude(structure_type=00)
    .exclude(structure_type=18)
    .exclude(structure_type=19)
)



@api_view(["GET"])
def national_bridges_location_and_field(request):

    if request.method == "GET":
        # base query
        fields = []
        bridges = bridges_only

        # TODO: More general way of retrieving query params?
        # Store as dictionary, then parse into:
        # base plot type
        # boolean params (columns to include)
        # filter params (lists or single values?)

        # base type of plot
        plot_type = request.query_params.get("plot_type")
        if plot_type == "rating":
            bridges = bridges.exclude(lowest_rating__isnull=True)
            fields.append("lowest_rating")
        elif plot_type == "year_built":
            bridges = bridges.exclude(year_built__isnull=True)
            fields.append("year_built")
        else:
            raise ValueError("Invalid plot type provided")

        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if (limit != None):
            num_limit = int(limit)
            bridges = bridges[:num_limit]

        # boolean field retrieval
        # TODO: Generalize retrieval
        rating = request.query_params.get("rating")
        if rating == "True":
            fields.append("rating")

        column_limits = fields
        column_limits.extend(["latitude", "longitude"])
        bridges = bridges.only(*column_limits)
        content = BridgeLocationFieldSerializer(bridges, fields=set(fields), many=True)

        return Response(content.data)
    else:
        return Response("", status=status.HTTP_400_BAD_REQUEST)
