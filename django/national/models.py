# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class BridgeMedian(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bridge_median'


class CulvertCondition(models.Model):
    code = models.IntegerField(unique=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'culvert_condition'


class DeckCondition(models.Model):
    code = models.IntegerField(unique=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'deck_condition'


class DesignLoad(models.Model):
    code = models.CharField(unique=True, max_length=1)
    metric_description = models.TextField(blank=True, null=True)
    english_description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'design_load'


class FunctionalClassificationOfInventoryRoute(models.Model):
    code = models.CharField(unique=True, max_length=2)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'functional_classification_of_inventory_route'


class HistoricalSignificance(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'historical_significance'


class LowestRating(models.Model):
    code = models.IntegerField(unique=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lowest_rating'


class Maintenance(models.Model):
    code = models.CharField(unique=True, max_length=2)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maintenance'


class MaintenanceResponsibility(models.Model):
    code = models.CharField(unique=True, max_length=2)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maintenance_responsibility'


class Bridge(models.Model):
    id = models.BigIntegerField(primary_key=True, null=False)
    structure_number = models.TextField(blank=True, null=True)
    inventory_route_record_type = models.TextField(blank=True, null=True)
    inventory_route_route_signing_prefix = models.TextField(blank=True, null=True)
    inventory_route_designated_level_of_service = models.TextField(blank=True, null=True)
    inventory_route_number = models.TextField(blank=True, null=True)
    inventory_route_direction = models.TextField(blank=True, null=True)
    highway_agency_district = models.TextField(blank=True, null=True)
    county_code = models.TextField(blank=True, null=True)
    place_code = models.TextField(blank=True, null=True)
    features_intersected = models.TextField(blank=True, null=True)
    critical_facility = models.TextField(blank=True, null=True)
    facility_carried = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    inventory_route_minimum_vertical_clearance = models.TextField(blank=True, null=True)
    kilometerpoint = models.TextField(blank=True, null=True)
    base_highway_network = models.TextField(blank=True, null=True)
    lrs_inventory_route = models.TextField(blank=True, null=True)
    subroute_number = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    bypass_detour_length = models.TextField(blank=True, null=True)
    year_bult = models.TextField(blank=True, null=True)
    traffic_lanes_on_structure = models.TextField(blank=True, null=True)
    traffic_lanes_under_structure = models.TextField(blank=True, null=True)
    average_daily_traffic = models.TextField(blank=True, null=True)
    year_of_average_daily_traffic = models.TextField(blank=True, null=True)
    approach_roadway_width = models.TextField(blank=True, null=True)
    skew_angle = models.TextField(blank=True, null=True)
    structure_flared = models.TextField(blank=True, null=True)
    navigation_control = models.TextField(blank=True, null=True)
    navigation_vertical_clearance = models.TextField(blank=True, null=True)
    navigation_horizontal_clearance = models.TextField(blank=True, null=True)
    structure_open_posted_closed_to_traffic = models.TextField(blank=True, null=True)
    type_of_service_on_bridge = models.TextField(blank=True, null=True)
    type_of_service_under_bridge = models.TextField(blank=True, null=True)
    structure_kind = models.TextField(blank=True, null=True)
    structure_type = models.TextField(blank=True, null=True)
    structure_type_approach_spans_material = models.TextField(blank=True, null=True)
    structure_type_approach_design = models.TextField(blank=True, null=True)
    main_unit_span_number = models.TextField(blank=True, null=True)
    number_of_approach_spans = models.TextField(blank=True, null=True)
    inventory_route_total_horizontal_clearance = models.TextField(blank=True, null=True)
    maximum_span_length = models.TextField(blank=True, null=True)
    structure_length = models.TextField(blank=True, null=True)
    left_curb_width = models.TextField(blank=True, null=True)
    right_curb_width = models.TextField(blank=True, null=True)
    bridge_roadway_width = models.TextField(blank=True, null=True)
    deck_width = models.TextField(blank=True, null=True)
    minimum_vertical_clearance_over_bridge_roadway = models.TextField(blank=True, null=True)
    minimum_vertical_underclearance_reference_feature = models.TextField(blank=True, null=True)
    minimum_vertical_underclearance = models.TextField(blank=True, null=True)
    minimum_lateral_underclearance_on_right = models.TextField(blank=True, null=True)
    minimum_lateral_underclearance_reference_feature = models.TextField(blank=True, null=True)
    minimum_lateral_underclearance_on_left = models.TextField(blank=True, null=True)
    channel_condition = models.TextField(blank=True, null=True)
    operating_rating_method = models.TextField(blank=True, null=True)
    operating_rating = models.TextField(blank=True, null=True)
    inventory_rating_method = models.TextField(blank=True, null=True)
    inventory_rating = models.TextField(blank=True, null=True)
    structural_evaluation = models.TextField(blank=True, null=True)
    deck_geometry_evaluation = models.TextField(blank=True, null=True)
    underclearance_evaluation = models.TextField(blank=True, null=True)
    posting_evaluation = models.TextField(blank=True, null=True)
    waterway_evaluation = models.TextField(blank=True, null=True)
    approach_roadway_alignment = models.TextField(blank=True, null=True)
    type_of_work_proposed = models.TextField(blank=True, null=True)
    type_of_work_done_by = models.TextField(blank=True, null=True)
    length_of_structure_improvement = models.TextField(blank=True, null=True)
    date_of_inspection = models.TextField(blank=True, null=True)
    designated_inspection_frequency = models.TextField(blank=True, null=True)
    critical_feature_inspection_fracture = models.TextField(blank=True, null=True)
    critical_feature_inspection_underwater = models.TextField(blank=True, null=True)
    critical_feature_inspection_other_special = models.TextField(blank=True, null=True)
    critical_feature_inspection_fracture_date = models.TextField(blank=True, null=True)
    critical_feature_inspection_underwater_date = models.TextField(blank=True, null=True)
    critical_feature_inspection_other_special_date = models.TextField(blank=True, null=True)
    bridge_improvement_cost = models.TextField(blank=True, null=True)
    roadway_improvement_cost = models.TextField(blank=True, null=True)
    total_project_improvement_cost = models.TextField(blank=True, null=True)
    year_of_improvement_cost_estimate = models.TextField(blank=True, null=True)
    border_bridge_neighboring_state_code = models.TextField(blank=True, null=True)
    border_bridge_percent_responsibility = models.TextField(blank=True, null=True)
    border_bridge_structure_number = models.TextField(blank=True, null=True)
    strahnet_highway_designation = models.TextField(blank=True, null=True)
    parallel_structure_designation = models.TextField(blank=True, null=True)
    traffic_direction = models.TextField(blank=True, null=True)
    temporary_structure_designation = models.TextField(blank=True, null=True)
    highway_system = models.TextField(blank=True, null=True)
    federal_lands_highway = models.TextField(blank=True, null=True)
    year_reconstructed = models.TextField(blank=True, null=True)
    deck_structure_type = models.TextField(blank=True, null=True)
    deck_wearing_surface_type = models.TextField(blank=True, null=True)
    deck_wearing_surface_membrane_type = models.TextField(blank=True, null=True)
    wearing_surface_deck_protection = models.TextField(blank=True, null=True)
    average_daily_truck_traffic = models.TextField(blank=True, null=True)
    national_network = models.TextField(blank=True, null=True)
    pier_or_abutment_protection = models.TextField(blank=True, null=True)
    nbis_bridge_length = models.TextField(blank=True, null=True)
    scour_critical = models.TextField(blank=True, null=True)
    future_average_daily_traffic = models.TextField(blank=True, null=True)
    year_of_future_average_daily_traffic = models.TextField(blank=True, null=True)
    minimum_navigation_vertical_clearance_vertical_lift_bridge = models.TextField(blank=True, null=True)
    federal_agency = models.TextField(blank=True, null=True)
    submitted_by = models.TextField(blank=True, null=True)
    bridge_condition = models.TextField(blank=True, null=True)
    deck_area = models.TextField(blank=True, null=True)


    state_id = models.IntegerField(blank=True, null=True)
    toll_id = models.IntegerField(blank=True, null=True)
    traffic_safety_features_approach_guardrail_ends_id = models.IntegerField(blank=True, null=True)
    design_load_id = models.IntegerField(blank=True, null=True)
    traffic_safety_features_approach_guardrail_id = models.IntegerField(blank=True, null=True)
    deck_condition_id = models.IntegerField(blank=True, null=True)
    functional_classification_of_inventory_route_id = models.IntegerField(blank=True, null=True)
    historical_significance_id = models.IntegerField(blank=True, null=True)
    substructure_condition_id = models.IntegerField(blank=True, null=True)
    traffic_safety_features_bridge_railings_id = models.IntegerField(blank=True, null=True)
    superstructure_condition_id = models.IntegerField(blank=True, null=True)
    bridge_median_id = models.IntegerField(blank=True, null=True)   
    owner_id = models.IntegerField(blank=True, null=True)
    maintenance_responsibility_id = models.IntegerField(blank=True, null=True)
    culvert_condition_id = models.IntegerField(blank=True, null=True)
    traffic_safety_features_transitions_id = models.IntegerField(blank=True, null=True)

    # lowest_rating_id = models.IntegerField(blank=True, null=True)
    lowest_rating = models.ForeignKey(LowestRating, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'nbi'


class Owner(models.Model):
    code = models.CharField(unique=True, max_length=2)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'owner'


class State(models.Model):
    name = models.CharField(unique=True, max_length=24)
    fips_code = models.CharField(unique=True, max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'state'


class SubstructureCondition(models.Model):
    code = models.IntegerField(unique=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'substructure_condition'


class SuperstructureCondition(models.Model):
    code = models.IntegerField(unique=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'superstructure_condition'


class Toll(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(unique=True, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toll'


class TrafficSafetyFeaturesApproachGuardrail(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_approach_guardrail'


class TrafficSafetyFeaturesApproachGuardrailEnds(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_approach_guardrail_ends'


class TrafficSafetyFeaturesBridgeRailings(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_bridge_railings'


class TrafficSafetyFeaturesTransitions(models.Model):
    code = models.CharField(unique=True, max_length=1)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_transitions'