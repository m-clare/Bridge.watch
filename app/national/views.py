from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.db.models import F, Count
from .writers import get_streaming_response
from django_pandas.io import read_frame
from django.http import HttpResponse
from django.http import JsonResponse
# Create your views here.

@api_view(["GET"])
def state_bridges_csv(request):
    if request.method =="GET":
        fields = []

        plot_type = request.query_params.get("plot_type")
        if plot_type == "rating":
            bridges = Bridge.objects.all()
            bridges = bridges.exclude(lowest_rating__code=None)
            fields.append(plot_type)
        # year built base
        elif plot_type == "year_built":
            bridges = Bridge.objects.all()
            bridges = bridges.exclude(year_built=None)
            fields.append(plot_type)
        elif plot_type == "repair_cost_per_foot":
            bridges = Bridge.objects.all()
            bridges = bridges.filter(year_of_improvement_cost_estimate__gte=2013)
            bridges = bridges.exclude(total_project_improvement_cost__in=[None, 0])
            bridges = bridges.exclude(length_of_structure_improvement__in=[None, 0])
            fields.append(plot_type)
        else:
            raise ValueError("invalid plot type provided")

        state = request.query_params.get("state")
        if state is not None:
            state_list = state.split(',')
            bridges = bridges.filter(state__fips_code__in=state_list)
            bridges = bridges.annotate(state_name=F('state__name'))
        bridges = bridges.annotate(fips_code=F('fips__code'))
        bridges = bridges.annotate(county_name=F('fips__county'))
        fields.append('county_name')
        fields.append('state_name')
        fields.append('fips_code')

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
        if ('repair_cost_per_foot' in fields):
            bridges = bridges.annotate(repair_cost_per_foot=(F('total_project_improvement_cost') / (F('length_of_structure_improvement') * 3.28)))
        # Get other interesting fields
        bridges = bridges.annotate(material=F('structure_kind__code'))
        bridges = bridges.annotate(type=F('structure_type__code'))
        bridges = bridges.annotate(service=F('type_of_service_on_bridge__code'))
        fields.extend(['material', 'type', 'service'])

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



@api_view(["GET"])
def national_bridges_csv(request):

    if request.method == "GET":
        # base query
        fields = []

        # todo: more general way of retrieving query params?
        # store as dictionary, then parse into:
        # base plot type
        # boolean params (columns to include)
        # filter params (lists or single values?)

        # base type of plot
        # rating base
        plot_type = request.query_params.get("plot_type")
        if plot_type == "rating":
            bridges = AbbrevRating.objects.all()
            fields.append(plot_type)
        # year built base
        elif plot_type == "year_built":
            bridges = AbbrevYearBuilt.objects.all()
            fields.append(plot_type)
        elif plot_type == "repair_cost_per_foot":
            bridges = Bridge.objects.all()
            bridges = bridges.filter(year_of_improvement_cost_estimate__gte=2013)
            bridges = bridges.exclude(total_project_improvement_cost__in=[None, 0])
            bridges = bridges.exclude(length_of_structure_improvement__in=[None, 0])
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
        if ('repair_cost_per_foot' in fields):
            bridges = bridges.annotate(repair_cost_per_foot=(F('total_project_improvement_cost') / (F('length_of_structure_improvement') * 3.28)))
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

def check_conditions(query_dict, value, bool_tuple):
    deck_bool = query_dict["deck_cond"] == value
    superstructure_bool = query_dict["superstructure_cond"] == value
    substructure_bool = query_dict["substructure_cond"] == value
    # check with tuple
    return (deck_bool, superstructure_bool, substructure_bool) == bool_tuple

@api_view(["GET"])
def bridge_conditions(request):
    fields = []
    condition_dictionary = {"G": [7, 8, 9], "F": [5, 6], "P": [0, 1, 2, 3, 4]}

    condition_ratings = {
        "9": "Excellent",
        "8": "Very Good",
        "7": "Good",
        "6": "Satisfactory",
        "5": "Fair",
        "4": "Poor",
        "3": "Serious",
        "2": "Critical",
        "1": "Imminent Failure",
        "0": "Failed",
    }
    cond_dict = {"G": {}, "F": {}, "P": {}}
    output_dict = {"name": "2021 Bridge Condition Data", "children": []}
    # TODO: Make more generic function to generate permutations
    permutation_dict = {
        "all components": (True, True, True),
        "deck and substructure": (True, False, True),
        "deck and superstructure": (True, True, False),
        "super/substructure": (False, True, True),
        "deck": (True, False, False),
        "superstructure": (False, True, False),
        "substructure": (False, False, True),
    }
    if request.method == "GET":
        state = request.query_params.get("state")
        bridges = Bridge.objects.all()
        bridges = bridges.exclude(lowest_rating__code=None)
        fields.append("rating")

        if ('rating' in fields):
            bridges = bridges.annotate(rating=F('lowest_rating__code'))
        if state is not None:
            state_list = state.split(',')
            bridges = bridges.filter(state__fips_code__in=state_list)
            bridges = bridges.annotate(state_name=F('state__name'))

        bridges = bridges.annotate(material=F('structure_kind__code'))
        bridges = bridges.annotate(bridge_cond=F('bridge_condition'))
        bridges = bridges.annotate(deck_cond=F('deck_condition__code'))
        bridges = bridges.annotate(superstructure_cond=F('superstructure_condition__code'))
        bridges = bridges.annotate(substructure_cond=F('substructure_condition__code'))
        fields.extend(["bridge_condition",
                       "deck_cond",
                       "superstructure_cond",
                       "substructure_cond"])

        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if (limit != None):
            num_limit = int(limit)
            bridges = bridges[:num_limit]

        bridge_cond_by_field = list(bridges.values(*fields).annotate(count=Count("pk")))

        for key, value_list in condition_dictionary.items():
            # first filter list of dictionaries to only those with relevant lowest rating
            for value in value_list:
                cond_dict[key][value] = [
                    x
                    for x in bridge_cond_by_field
                    if (x["bridge_condition"] == key and x["rating"] == value)
                ]
        for condition_letter, rating_dictionary in cond_dict.items():
            name_dict = {"name": condition_letter, "children": []}
            for rating, matching_counts in rating_dictionary.items():
                values_dict = {
                    "name": f"{condition_ratings[str(rating)]} Condition ({str(rating)})",
                    "children": [],
                }
                child_list = []
                # Initialize condition dictionaries
                component_counts = {}
                for component_state, bool_tuple in permutation_dict.items():
                    component_counts[component_state] = 0
                for count in matching_counts:
                    for component_state, bool_tuple in permutation_dict.items():
                        condition_match = check_conditions(
                            count, rating, bool_tuple
                        )
                        if condition_match:
                            component_counts[component_state] += count["count"]
                # create arrays for d3
                for component, count in component_counts.items():
                    child_list.append(
                        {
                            "name": component + " at " + str(rating),
                            "value": count,
                        }
                    )
                values_dict["children"] = child_list
                name_dict["children"].append(values_dict)
            output_dict["children"].append(name_dict)
        return JsonResponse(output_dict)
    else:
        return Response("", status=status.HTTP_400_BAD_REQUEST)
