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
import copy
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

def check_new_conditions(query_dict, value, permutation_mapping):
    deck_bool = query_dict["deck_cond"] == value
    superstructure_bool = query_dict["superstructure_cond"] == value
    substructure_bool = query_dict["substructure_cond"] == value
    return permutation_mapping[(deck_bool, superstructure_bool, substructure_bool)]

@api_view(["GET"])
def bridge_conditions(request):
    fields = []

    material_options = {
        "Reinforced Concrete": [1,2],
        "Steel": [3,4],
        "Prestressed or Post-tensioned Concrete": [5,6],
        "Wood or Timber": [7],
        "Masonry": [8],
        "Aluminum, Wrought Iron, or Cast Iron": [9],
        "Other": [0],
    };

    material_mapping = {
        1: "Reinforced Concrete",
        2: "Reinforced Concrete",
        3: "Steel",
        4: "Steel",
        5: "Prestressed or Post-tensioned Concrete",
        6: "Prestressed or Post-tensioned Concrete",
        7: "Wood or Timber",
        8: "Masonry",
        9: "Aluminum, Wrought Iron, or Cast Iron",
        0: "Other"
    }

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
    output_dict = {"name": "2021 Bridge Condition Data", "type": "material", "children": []}

    condition_mapping = {
        "G": "In Good Condition (7, 8, 9)",
        "F": "In Fair Condition (5, 6)",
        "P": "In Poor Condition (0, 1, 2, 3, 4)",
    }

    component_counts = {"all components": 0,
                        "superstructure and substructure": 0,
                        "deck and substructure": 0,
                        "deck and superstructure": 0,
                        "substructure": 0,
                        "superstructure": 0,
                        "deck": 0,
                        "mismatched or missing component ratings": 0}

    permutation_mapping = {
        (True, True, True): "all components",
        (True, False, True): "deck and substructure",
        (True, True, False): "deck and superstructure",
        (False, True, True): "superstructure and substructure",
        (True, False, False): "deck",
        (False, True, False): "superstructure",
        (False, False, True): "substructure",
        (False, False, False): "mismatched or missing component ratings"
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
        fields.extend(["material",
                       "bridge_condition",
                       "deck_cond",
                       "superstructure_cond",
                       "substructure_cond"])

        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if (limit != None):
            num_limit = int(limit)
            bridges = bridges[:num_limit]

        bridge_cond_by_field = list(bridges.values(*fields).annotate(count=Count("pk")))

        field_cond_dict = {}
        new_cond_dict = {"In Good Condition (7, 8, 9)": {7: component_counts.copy(),
                                               8: component_counts.copy(),
                                               9: component_counts.copy()},
                         "In Fair Condition (5, 6)": {5: component_counts.copy(),
                                               6: component_counts.copy()},
                         "In Poor Condition (0, 1, 2, 3, 4)": {0: component_counts.copy(),
                                               1: component_counts.copy(),
                                               2: component_counts.copy(),
                                               3: component_counts.copy(),
                                               4: component_counts.copy()}}

        for material_name in material_options.keys():
            field_cond_dict[material_name] = copy.deepcopy(new_cond_dict)
        for unique_condition in bridge_cond_by_field:
            material_name = material_mapping[unique_condition["material"]]
            condition = condition_mapping[unique_condition["bridge_condition"]]
            rating = unique_condition["rating"]
            component_state = check_new_conditions(unique_condition, rating, permutation_mapping)
            field_cond_dict[material_name][condition][rating][component_state] += unique_condition["count"]

        # create d3 output
        for field, bridge_cond_dict in field_cond_dict.items():
            field_dict = {'name': field, "children": []}
            # G, F, P
            for condition_description, rating_dictionary in bridge_cond_dict.items():
                name_dict = {"name": condition_description, "children": []}
                # [7, 8, 9], [5, 6], [0, 1, 2, 3, 4]
                for numerical_rating, rating_component_counts in rating_dictionary.items():
                    values_dict = {
                        "name": f"{condition_ratings[str(numerical_rating)]} Condition ({str(numerical_rating)})",
                        "children": [],
                    }
                    child_list = []
                    # create arrays for d3
                    for component, count in rating_component_counts.items():
                        child_list.append(
                            {
                                "name": component + " at " + str(numerical_rating),
                                "value": count,
                            }
                        )
                    values_dict["children"] = child_list
                    name_dict["children"].append(values_dict)
                field_dict["children"].append(name_dict)
            output_dict["children"].append(field_dict)
        return JsonResponse(output_dict)
    else:
        return Response("", status=status.HTTP_400_BAD_REQUEST)
