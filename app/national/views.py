from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.db.models import F, Count
from .writers import get_streaming_response
from django_pandas.io import read_frame
from django.http import JsonResponse
from datetime import timedelta
from datetime import date
import copy

# Create your views here.
def first_day_of_next_month(dt):
    return (dt.replace(day=1) + timedelta(days=32)).replace(day=1)


@api_view(["GET"])
def state_bridges_csv(request):
    if request.method == "GET":
        fields = []

        plot_type = request.query_params.get("plot_type")

        bridges = Bridge.objects.all()
        if plot_type == "rating":
            bridges = bridges.exclude(lowest_rating__code=None)
            fields.append(plot_type)
        # year built base
        elif plot_type == "year_built":
            bridges = bridges.exclude(year_built=None)
            fields.append(plot_type)
        elif plot_type == "repair_cost_per_foot":
            bridges = bridges.filter(year_of_improvement_cost_estimate__gte=2013)
            bridges = bridges.exclude(total_project_improvement_cost__in=[None, 0])
            bridges = bridges.exclude(length_of_structure_improvement__in=[None, 0])
            fields.append(plot_type)
        elif plot_type == "average_daily_traffic":
            bridges = bridges.exclude(average_daily_traffic__in=[None, 0])
            fields.append(plot_type)
        elif plot_type == "truck_traffic":
            bridges = bridges.exclude(average_daily_truck_traffic__in=[None, 0])
            bridges = bridges.exclude(average_daily_traffic__in=[None, 0])
            fields.append(plot_type)
        elif plot_type == "future_date_of_inspection":
            # day1 = first_day_of_next_month(date.today())
            day1 = date.today().replace(day=1)
            one_year_from_now = day1 + timedelta(days=370)
            bridges = bridges.exclude(future_date_of_inspection=None)
            bridges = bridges.filter(future_date_of_inspection__lt=one_year_from_now)
            bridges = bridges.filter(future_date_of_inspection__gte=day1)
            fields.append(plot_type)
        else:
            raise ValueError("invalid plot type provided")

        state = request.query_params.get("state")
        if state is not None:
            state_list = state.split(",")
            bridges = bridges.filter(state__fips_code__in=state_list)
            bridges = bridges.annotate(state_name=F("state__name"))
        bridges = bridges.annotate(fips_code=F("fips__code"))
        bridges = bridges.annotate(county_name=F("fips__county"))
        fields.append("county_name")
        fields.append("state_name")
        fields.append("fips_code")

        # material type
        material = request.query_params.get("material")
        if material is not None:
            material_list = material.split(",")
            bridges = bridges.filter(structure_kind__code__in=material_list)
        # bridge type
        type = request.query_params.get("type")
        if type is not None:
            type_list = type.split(",")
            bridges = bridges.filter(structure_type__code__in=type_list)
        # bridge service
        service = request.query_params.get("service")
        if service is not None:
            service_list = service.split(",")
            bridges = bridges.filter(type_of_service_on_bridge__code__in=service_list)
        # bridge service under
        service_under = request.query_params.get("service_under")
        if service_under is not None:
            service_under_list = service_under.split(",")
            bridges = bridges.filter(type_of_service_under_bridge__code__in=service_under_list)
        # bridge deck structure type
        deck_type = request.query_params.get("deck_type")
        if deck_type is not None:
            deck_type_list = deck_type.split(",")
            deck_type_list = [int(item) for item in deck_type_list]
            bridges = bridges.filter(deck_structure_type__code__in=deck_type_list)
        # bridge deck surface type
        deck_surface = request.query_params.get("deck_surface")
        if deck_surface is not None:
            deck_surface_list = deck_surface.split(",")
            bridges = bridges.filter(deck_wearing_surface_type__code__in=deck_surface_list)

        # DETAILED FILTERS
        # year range
        min_year = request.query_params.get("min_year")
        if min_year is not None:
            bridges = bridges.filter(year_built__gte=min_year)
        max_year = request.query_params.get("max_year")
        if max_year is not None:
            bridges = bridges.filter(year_built__lte=max_year)
        min_traffic = request.query_params.get("min_traffic")
        if min_traffic is not None:
            bridges = bridges.filter(average_daily_traffic__gte=min_traffic)
        max_traffic = request.query_params.get("max_traffic")
        if max_traffic is not None:
            bridges = bridges.filter(average_daily_traffic__lte=max_traffic)
        ratings = request.query_params.get("ratings")
        # ratings
        if ratings is not None:
            ratings_list = ratings.split(",")
            bridges = bridges.filter(lowest_rating__code__in=ratings_list)
        # length range
        min_bridge_length = request.query_params.get("min_bridge_length")
        if min_bridge_length is not None:
            # convert feet to meters
            min_bridge_length_m = float(min_bridge_length) * 0.3048
            bridges = bridges.filter(structure_length__gte=min_bridge_length_m)
        max_bridge_length = request.query_params.get("max_bridge_length")
        if max_bridge_length is not None:
            # convert feet to meters
            max_bridge_length_m = float(max_bridge_length) * 0.3048
            bridges = bridges.filter(structure_length__lte=max_bridge_length_m)
        min_span_length = request.query_params.get("min_span_length")
        if min_span_length is not None:
            # convert feet to meters
            min_span_length_m = float(min_span_length) * 0.3048
            bridges = bridges.filter(maximum_span_length__gte=min_span_length_m)
        max_span_length = request.query_params.get("max_span_length")
        if max_span_length is not None:
            # convert feet to meters
            max_span_length_m = float(max_span_length) * 0.3048
            bridges = bridges.filter(maximum_span_length__lte=max_span_length_m)


        fields.extend(["latitude", "longitude"])
        if "rating" in fields:
            bridges = bridges.annotate(rating=F("lowest_rating__code"))
        if "repair_cost_per_foot" in fields:
            bridges = bridges.annotate(
                repair_cost_per_foot=(
                    F("total_project_improvement_cost")
                    / (F("length_of_structure_improvement") * 3.28)
                )
            )
        if "truck_traffic" in fields:
            bridges = bridges.annotate(
                truck_traffic=(
                    F("average_daily_traffic") * F("average_daily_truck_traffic") * 0.01
                )
            )

        # Get other interesting fields
        bridges = bridges.annotate(material=F("structure_kind__code"))
        bridges = bridges.annotate(type=F("structure_type__code"))
        bridges = bridges.annotate(service=F("type_of_service_on_bridge__code"))
        bridges = bridges.annotate(service_under=F("type_of_service_under_bridge__code"))
        fields.extend(["material", "type", "service", "service_under"])

        bridges = bridges.values_list(*fields)

        print(len(bridges))
        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if limit != None:
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
        bridges = Bridge.objects.all()
        plot_type = request.query_params.get("plot_type")
        if plot_type == "rating":
            bridges = bridges.exclude(lowest_rating__code=None)
            fields.append(plot_type)
        # year built base
        elif plot_type == "year_built":
            bridges = bridges.exclude(year_built=None)
            fields.append(plot_type)
        elif plot_type == "repair_cost_per_foot":
            bridges = bridges.filter(year_of_improvement_cost_estimate__gte=2013)
            bridges = bridges.exclude(total_project_improvement_cost__in=[None, 0])
            bridges = bridges.exclude(length_of_structure_improvement__in=[None, 0])
            fields.append(plot_type)
        elif plot_type == "average_daily_traffic":
            bridges = bridges.exclude(average_daily_traffic__in=[None, 0])
            fields.append(plot_type)
        elif plot_type == "truck_traffic":
            bridges = bridges.exclude(average_daily_truck_traffic__in=[None, 0])
            bridges = bridges.exclude(average_daily_traffic__in=[None, 0])
            fields.append(plot_type)
        elif plot_type == "future_date_of_inspection":
            day1 = date.today().replace(day=1)
            one_year_from_now = day1 + timedelta(days=370)
            bridges = bridges.exclude(future_date_of_inspection=None)
            # bridges = bridges.filter(future_date_of_inspection__lt=day1)
            bridges = bridges.filter(future_date_of_inspection__lt=one_year_from_now)
            bridges = bridges.filter(future_date_of_inspection__gte=day1)
            fields.append(plot_type)
        else:
            raise ValueError("invalid plot type provided")

        # material type
        material = request.query_params.get("material")
        if material is not None:
            material_list = material.split(",")
            bridges = bridges.filter(structure_kind__code__in=material_list)
        # bridge type
        type = request.query_params.get("type")
        if type is not None:
            type_list = type.split(",")
            bridges = bridges.filter(structure_type__code__in=type_list)
        # bridge service
        service = request.query_params.get("service")
        if service is not None:
            service_list = service.split(",")
            bridges = bridges.filter(type_of_service_on_bridge__code__in=service_list)
        # bridge service under
        service_under = request.query_params.get("service_under")
        if service_under is not None:
            service_under_list = service_under.split(",")
            bridges = bridges.filter(type_of_service_under_bridge__code__in=service_under_list)
        # bridge deck structure type
        deck_type = request.query_params.get("deck_type")
        if deck_type is not None:
            deck_type_list = deck_type.split(",")
            bridges = bridges.filter(deck_structure_type__code__in=deck_type_list)
        # bridge deck surface type
        deck_surface = request.query_params.get("deck_surface")
        if deck_surface is not None:
            deck_surface_list = deck_surface.split(",")
            bridges = bridges.filter(deck_wearing_surface_type__code__in=deck_surface_list)

        # DETAILED FILTERS
        # year range
        min_year = request.query_params.get("min_year")
        if min_year is not None:
            bridges = bridges.filter(year_built__gte=min_year)
        max_year = request.query_params.get("max_year")
        if max_year is not None:
            bridges = bridges.filter(year_built__lte=max_year)
        min_traffic = request.query_params.get("min_traffic")
        if min_traffic is not None:
            bridges = bridges.filter(average_daily_traffic__gte=min_traffic)
        max_traffic = request.query_params.get("max_traffic")
        if max_traffic is not None:
            bridges = bridges.filter(average_daily_traffic__lte=max_traffic)
        ratings = request.query_params.get("ratings")
        # ratings
        if ratings is not None:
            ratings_list = ratings.split(",")
            bridges = bridges.filter(lowest_rating__code__in=ratings_list)
        # length range
        min_bridge_length = request.query_params.get("min_bridge_length")
        if min_bridge_length is not None:
            # convert feet to meters
            min_bridge_length_m = float(min_bridge_length) * 0.3048
            bridges = bridges.filter(structure_length__gte=min_bridge_length_m)
        max_bridge_length = request.query_params.get("max_bridge_length")
        if max_bridge_length is not None:
            # convert feet to meters
            max_bridge_length_m = float(max_bridge_length) * 0.3048
            bridges = bridges.filter(structure_length__lte=max_bridge_length_m)
        min_span_length = request.query_params.get("min_span_length")
        if min_span_length is not None:
            # convert feet to meters
            min_span_length_m = float(min_span_length) * 0.3048
            bridges = bridges.filter(maximum_span_length__gte=min_span_length_m)
        max_span_length = request.query_params.get("max_span_length")
        if max_span_length is not None:
            # convert feet to meters
            max_span_length_m = float(max_span_length) * 0.3048
            bridges = bridges.filter(maximum_span_length__lte=max_span_length_m)

        fields.extend(["latitude", "longitude"])
        if "rating" in fields:
            bridges = bridges.annotate(rating=F("lowest_rating__code"))
        if "repair_cost_per_foot" in fields:
            bridges = bridges.annotate(
                repair_cost_per_foot=(
                    F("total_project_improvement_cost")
                    / (F("length_of_structure_improvement") * 3.28)
                )
            )
        if "truck_traffic" in fields:
            bridges = bridges.annotate(
                truck_traffic=(
                    F("average_daily_traffic") * F("average_daily_truck_traffic") * 0.01
                )
            )
        bridges = bridges.values_list(*fields)

        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if limit != None:
            num_limit = int(limit)
            bridges = bridges[:num_limit]

        # df = read_frame(bridges, fieldnames=fields)
        # response = HttpResponse(content_type='text/csv')
        # df.to_csv(path_or_buf=response, index=False)
        # return response

        return get_streaming_response(bridges, fields)
    else:
        return Response("", status=status.HTTP_400_BAD_REQUEST)

def check_conditions(query_dict, value, permutation_mapping):
    deck_bool = query_dict["deck_cond"] == value
    superstructure_bool = query_dict["superstructure_cond"] == value
    substructure_bool = query_dict["substructure_cond"] == value
    return permutation_mapping[(deck_bool, superstructure_bool, substructure_bool)]

@api_view(["GET"])
def bridge_conditions(request):
    fields = []

    field_options = {
        "material": {
            "forward_map": {
                "Reinforced Concrete": [1, 2],
                "Prestressed or Post-tensioned Concrete": [5, 6],
                "Masonry": [8],
                "Steel": [3, 4],
                "Aluminum, Wrought Iron, or Cast Iron": [9],
                "Wood or Timber": [7],
                "Other": [0],
            },
            "reverse_map": {
                1: "Reinforced Concrete",
                2: "Reinforced Concrete",
                3: "Steel",
                4: "Steel",
                5: "Prestressed or Post-tensioned Concrete",
                6: "Prestressed or Post-tensioned Concrete",
                7: "Wood or Timber",
                8: "Masonry",
                9: "Aluminum, Wrought Iron, or Cast Iron",
                0: "Other",
            },
        },
        "type": {
            "forward_map": {
                "Slab": [1],
                "Tee Beam": [4],
                "Box Beam or Girders": [2, 3, 5, 6],
                "Frame": [7],
                "Orthotropic": [8],
                "Truss": [9, 10],
                "Arch": [11, 12],
                "Suspension": [13],
                "Stayed Girder": [14],
                "Movable (Lift, Bascule, or Swing)": [15, 16, 17],
                "Segmental Box Girder": [21],
                "Channel Beam": [22],
            },
            "reverse_map": {
                1: "Slab",
                4: "Tee Beam",
                2: "Box Beam or Girders",
                3: "Box Beam or Girders",
                5: "Box Beam or Girders",
                6: "Box Beam or Girders",
                7: "Frame",
                8: "Orthotropic",
                9: "Truss",
                10: "Truss",
                11: "Arch",
                12: "Arch",
                13: "Suspension",
                14: "Stayed Girder",
                15: "Movable (Lift, Bascule, or Swing)",
                16: "Movable (Lift, Bascule, or Swing)",
                17: "Movable (Lift, Bascule, or Swing)",
                21: "Segmental Box Girder",
                22: "Channel Beam",
            },
        },
        "service": {
            "forward_map": {
                "Highway": 1,
                "Railroad": 2,
                "Pedestrian / bicycle": 3,
                "Highway / railroad": 4,
                "Highway / pedestrian": 5,
                "Overpass structure at an interchange": 6,
                "Third level (interchange)": 7,
                "Fourth level (interchange)": 8,
                "Building or plaza": 9,
                "Other": 0,
            },
            "reverse_map": {
                1: "Highway",
                2: "Railroad",
                3: "Pedestrian / bicycle",
                4: "Highway / railroad",
                5: "Highway / pedestrian",
                6: "Overpass structure at an interchange",
                7: "Third level (interchange)",
                8: "Fourth level (interchange)",
                9: "Building or plaza",
                0: "Other",
            },
        },
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

    condition_mapping = {
        "G": "In Good Condition (7, 8, 9)",
        "F": "In Fair Condition (5, 6)",
        "P": "In Poor Condition (0, 1, 2, 3, 4)",
    }

    component_counts = {
        "all components": 0,
        "superstructure and substructure": 0,
        "deck and substructure": 0,
        "deck and superstructure": 0,
        "substructure": 0,
        "superstructure": 0,
        "deck": 0,
        "mismatched or missing component ratings": 0,
    }

    permutation_mapping = {
        (True, True, True): "all components",
        (True, False, True): "deck and substructure",
        (True, True, False): "deck and superstructure",
        (False, True, True): "superstructure and substructure",
        (True, False, False): "deck",
        (False, True, False): "superstructure",
        (False, False, True): "substructure",
        (False, False, False): "mismatched or missing component ratings",
    }
    if request.method == "GET":

        bridges = Bridge.objects.all()
        bridges = bridges.exclude(lowest_rating__code=None)
        bridges = bridges.annotate(rating=F("lowest_rating__code"))
        fields.append("rating")

        # Get outermost categories
        field = request.query_params.get("field")
        if field == "material":
            fields.append("material")
            bridges = bridges.exclude(structure_kind__code=None)
            bridges = bridges.annotate(material=F("structure_kind__code"))
        if field == "type":
            fields.append("type")
            bridges = bridges.exclude(structure_type__code=None)
            bridges = bridges.annotate(type=F("structure_type__code"))
        if field == "service":
            fields.append("service")
            bridges = bridges.exclude(structure_type__code=None)
            bridges = bridges.annotate(service=F("type_of_service_on_bridge__code"))

        # Apply filters
        state = request.query_params.get("state")
        if state is not None:
            state_list = state.split(",")
            bridges = bridges.filter(state__fips_code__in=state_list)
        material = request.query_params.get("material")
        if material is not None:
            material_list = material.split(",")
            bridges = bridges.filter(structure_kind__code__in=material_list)
        # bridge type
        type = request.query_params.get("type")
        if type is not None:
            type_list = type.split(",")
            bridges = bridges.filter(structure_type__code__in=type_list)
        # bridge service
        service = request.query_params.get("service")
        if service is not None:
            service_list = service.split(",")
            bridges = bridges.filter(type_of_service_on_bridge__code__in=service_list)
        # bridge service under
        service_under = request.query_params.get("service_under")
        if service_under is not None:
            service_under_list = service_under.split(",")
            bridges = bridges.filter(type_of_service_under_bridge__code__in=service_under_list)
        # bridge deck structure type
        deck_type = request.query_params.get("deck_type")
        if deck_type is not None:
            deck_type_list = deck_type.split(",")
            bridges = bridges.filter(deck_structure_type__code__in=deck_type_list)
        # bridge deck surface type
        deck_surface = request.query_params.get("deck_surface")
        if deck_surface is not None:
            deck_surface_list = deck_surface.split(",")
            bridges = bridges.filter(deck_wearing_surface_type__code__in=deck_surface_list)

        # DETAILED FILTERS
        # year range
        min_year = request.query_params.get("min_year")
        if min_year is not None:
            bridges = bridges.filter(year_built__gte=min_year)
        max_year = request.query_params.get("max_year")
        if max_year is not None:
            bridges = bridges.filter(year_built__lte=max_year)
        min_traffic = request.query_params.get("min_traffic")
        if min_traffic is not None:
            bridges = bridges.filter(average_daily_traffic__gte=min_traffic)
        max_traffic = request.query_params.get("max_traffic")
        if max_traffic is not None:
            bridges = bridges.filter(average_daily_traffic__lte=max_traffic)
        ratings = request.query_params.get("ratings")
        # ratings
        if ratings is not None:
            ratings_list = ratings.split(",")
            bridges = bridges.filter(lowest_rating__code__in=ratings_list)
        # length range
        min_bridge_length = request.query_params.get("min_bridge_length")
        if min_bridge_length is not None:
            # convert feet to meters
            min_bridge_length_m = float(min_bridge_length) * 0.3048
            bridges = bridges.filter(structure_length__gte=min_bridge_length_m)
        max_bridge_length = request.query_params.get("max_bridge_length")
        if max_bridge_length is not None:
            # convert feet to meters
            max_bridge_length_m = float(max_bridge_length) * 0.3048
            bridges = bridges.filter(structure_length__lte=max_bridge_length_m)
        min_span_length = request.query_params.get("min_span_length")
        if min_span_length is not None:
            # convert feet to meters
            min_span_length_m = float(min_span_length) * 0.3048
            bridges = bridges.filter(maximum_span_length__gte=min_span_length_m)
        max_span_length = request.query_params.get("max_span_length")
        if max_span_length is not None:
            # convert feet to meters
            max_span_length_m = float(max_span_length) * 0.3048
            bridges = bridges.filter(maximum_span_length__lte=max_span_length_m)


        bridges = bridges.annotate(bridge_cond=F("bridge_condition__code"))
        bridges = bridges.annotate(deck_cond=F("deck_condition__code"))
        bridges = bridges.annotate(
            superstructure_cond=F("superstructure_condition__code")
        )
        bridges = bridges.annotate(substructure_cond=F("substructure_condition__code"))
        fields.extend(
            ["bridge_cond", "deck_cond", "superstructure_cond", "substructure_cond"]
        )

        # limit query results for troubleshooting
        limit = request.query_params.get("limit")
        if limit != None:
            num_limit = int(limit)
            bridges = bridges[:num_limit]

        bridge_cond_by_field = list(bridges.values(*fields).annotate(count=Count("pk")))

        field_cond_dict = {}
        new_cond_dict = {
            "In Good Condition (7, 8, 9)": {
                7: component_counts.copy(),
                8: component_counts.copy(),
                9: component_counts.copy(),
            },
            "In Fair Condition (5, 6)": {
                5: component_counts.copy(),
                6: component_counts.copy(),
            },
            "In Poor Condition (0, 1, 2, 3, 4)": {
                0: component_counts.copy(),
                1: component_counts.copy(),
                2: component_counts.copy(),
                3: component_counts.copy(),
                4: component_counts.copy(),
            },
        }

        for name in field_options[field]["forward_map"].keys():
            field_cond_dict[name] = copy.deepcopy(new_cond_dict)
        for unique_condition in bridge_cond_by_field:
            if field == "state":  # due to django field clash on state vs state_name
                name = field_options[field]["reverse_map"][
                    unique_condition["state_fips"]
                ]
            else:
                name = field_options[field]["reverse_map"][unique_condition[field]]
            condition = condition_mapping[unique_condition["bridge_cond"]]
            rating = unique_condition["rating"]
            component_state = check_conditions(
                unique_condition, rating, permutation_mapping
            )
            field_cond_dict[name][condition][rating][
                component_state
            ] += unique_condition["count"]

        output_dict = {
            "name": "2021 Bridge Condition Data",
            "field": field,
            "children": [],
        }

        # create d3 output
        for field, bridge_cond_dict in field_cond_dict.items():
            field_dict = {"name": field, "children": []}
            # G, F, P
            for condition_description, rating_dictionary in bridge_cond_dict.items():
                name_dict = {"name": condition_description, "children": []}
                # [7, 8, 9], [5, 6], [0, 1, 2, 3, 4]
                for (
                    numerical_rating,
                    rating_component_counts,
                ) in rating_dictionary.items():
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


