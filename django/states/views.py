from django.db.models import Count
from django.http import HttpResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Bridge
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

state_mapping = {
    "Alabama": 1,
    "Alaska": 2,
    "Arizona": 4,
    "Arkansas": 5,
    "California": 6,
    "Colorado": 8,
    "Connecticut": 9,
    "Delaware": 10,
    "District of Columbia": 11,
    "Florida": 12,
    "Georgia": 13,
    "Hawaii": 15,
    "Idaho": 16,
    "Illinois": 17,
    "Indiana": 18,
    "Iowa": 19,
    "Kansas": 20,
    "Kentucky": 21,
    "Louisiana": 22,
    "Maine": 23,
    "Maryland": 24,
    "Massachusetts": 25,
    "Michigan": 26,
    "Minnesota": 27,
    "Mississippi": 28,
    "Missouri": 29,
    "Montana": 30,
    "Nebraska": 31,
    "Nevada": 32,
    "New Hampshire": 33,
    "New Jersey": 34,
    "New Mexico": 35,
    "New York": 36,
    "North Carolina": 37,
    "North Dakota": 38,
    "Ohio": 39,
    "Oklahoma": 40,
    "Oregon": 41,
    "Pennsylvania": 42,
    "Rhode Island": 44,
    "South Carolina": 45,
    "South Dakota": 46,
    "Tennessee": 47,
    "Texas": 48,
    "Utah": 49,
    "Vermont": 50,
    "Virginia": 51,
    "Washington": 53,
    "West Virginia": 54,
    "Wisconsin": 55,
    "Wyoming": 56,
    "Puerto Rico": 72,
    "Guam": 66,
    "Virgin Islands": 78,
}


@api_view(["GET"])
def national_bridges_location_and_field(request):

    if request.method == "GET":
        # base query
        fields = []
        bridges = bridges_only
        # Possible filter options (i.e. rating, type, year built, year inspected)
        rating = request.query_params.get("rating")
        # kind = request.query_params.getlist("kind")
        kind = request.query_params.get("kind")
        year_built = request.query_params.get("year-built")
        # TODO: Better rating filter method...
        if rating is not None:
            bridges = bridges.exclude(rating__isnull=True)
            fields.append('rating')
        if kind is not None:
            # bridges = bridges.filter(structure_kind__in=kind)
            fields.append('structure_kind')
        if year_built is not None:
            fields.append('year_built')

        content = BridgeLocationFieldSerializer(bridges, fields=set(fields), many=True)
        return Response(content.data)
    else:
        return Response("", status=status.HTTP_400_BAD_REQUEST)
