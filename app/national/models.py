# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AbbrevRating(models.Model):
    structure_number = models.TextField(blank=True, null=True)
    state = models.ForeignKey('State', models.DO_NOTHING, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    structure_type = models.ForeignKey('StructureType', models.DO_NOTHING, blank=True, null=True)
    structure_kind = models.ForeignKey('StructureKind', models.DO_NOTHING, blank=True, null=True)
    lowest_rating = models.ForeignKey('LowestRating', models.DO_NOTHING, blank=True, null=True)
    year_built = models.IntegerField(blank=True, null=True)
    superstructure_condition = models.ForeignKey('SuperstructureCondition', models.DO_NOTHING, blank=True, null=True)
    substructure_condition = models.ForeignKey('SubstructureCondition', models.DO_NOTHING, blank=True, null=True)
    deck_condition = models.ForeignKey('DeckCondition', models.DO_NOTHING, blank=True, null=True)
    type_of_service_on_bridge = models.ForeignKey('TypeOfServiceOnBridge', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'abbrev_rating'


class AbbrevYearBuilt(models.Model):
    structure_number = models.TextField(blank=True, null=True)
    state = models.ForeignKey('State', models.DO_NOTHING, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    structure_type = models.ForeignKey('StructureType', models.DO_NOTHING, blank=True, null=True)
    structure_kind = models.ForeignKey('StructureKind', models.DO_NOTHING, blank=True, null=True)
    lowest_rating = models.ForeignKey('LowestRating', models.DO_NOTHING, blank=True, null=True)
    year_built = models.IntegerField(blank=True, null=True)
    superstructure_condition = models.ForeignKey('SuperstructureCondition', models.DO_NOTHING, blank=True, null=True)
    substructure_condition = models.ForeignKey('SubstructureCondition', models.DO_NOTHING, blank=True, null=True)
    deck_condition = models.ForeignKey('DeckCondition', models.DO_NOTHING, blank=True, null=True)
    type_of_service_on_bridge = models.ForeignKey('TypeOfServiceOnBridge', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'abbrev_year_built'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class BridgeMedian(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bridge_median'


class DeckCondition(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'deck_condition'


class DesignLoad(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    metric_description = models.TextField(blank=True, null=True)
    english_description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'design_load'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class FunctionalClassificationOfInventoryRoute(models.Model):
    code = models.CharField(unique=True, max_length=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'functional_classification_of_inventory_route'


class HistoricalSignificance(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'historical_significance'


class LowestRating(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lowest_rating'


class MaintenanceResponsibility(models.Model):
    code = models.CharField(unique=True, max_length=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maintenance_responsibility'


class Bridge(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    structure_number = models.TextField(blank=True, null=True)
    inventory_route_record_type = models.TextField(blank=True, null=True)
    inventory_route_route_signing_prefix = models.TextField(blank=True, null=True)
    inventory_route_designated_level_of_service = models.TextField(blank=True, null=True)
    inventory_route_number = models.TextField(blank=True, null=True)
    inventory_route_direction = models.TextField(blank=True, null=True)
    highway_agency_district = models.TextField(blank=True, null=True)
    county_code = models.TextField(blank=True, null=True)
    place_code = models.TextField(blank=True, null=True)
    features_intersected = models.CharField(max_length=28, blank=True, null=True)
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
    year_built = models.IntegerField(blank=True, null=True)
    traffic_lanes_on_structure = models.TextField(blank=True, null=True)
    traffic_lanes_under_structure = models.TextField(blank=True, null=True)
    average_daily_traffic = models.TextField(blank=True, null=True)
    year_of_average_daily_traffic = models.IntegerField(blank=True, null=True)
    approach_roadway_width = models.TextField(blank=True, null=True)
    skew_angle = models.TextField(blank=True, null=True)
    structure_flared = models.TextField(blank=True, null=True)
    navigation_control = models.TextField(blank=True, null=True)
    navigation_vertical_clearance = models.TextField(blank=True, null=True)
    navigation_horizontal_clearance = models.TextField(blank=True, null=True)
    structure_open_posted_closed_to_traffic = models.TextField(blank=True, null=True)
    type_of_service_under_bridge = models.TextField(blank=True, null=True)
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
    length_of_structure_improvement = models.FloatField(blank=True, null=True)
    date_of_inspection = models.TextField(blank=True, null=True)
    designated_inspection_frequency = models.TextField(blank=True, null=True)
    critical_feature_inspection_fracture = models.TextField(blank=True, null=True)
    critical_feature_inspection_underwater = models.TextField(blank=True, null=True)
    critical_feature_inspection_other_special = models.TextField(blank=True, null=True)
    critical_feature_inspection_fracture_date = models.TextField(blank=True, null=True)
    critical_feature_inspection_underwater_date = models.TextField(blank=True, null=True)
    critical_feature_inspection_other_special_date = models.TextField(blank=True, null=True)
    bridge_improvement_cost = models.FloatField(blank=True, null=True)
    roadway_improvement_cost = models.FloatField(blank=True, null=True)
    total_project_improvement_cost = models.FloatField(blank=True, null=True)
    year_of_improvement_cost_estimate = models.IntegerField(blank=True, null=True)
    border_bridge_neighboring_state_code = models.TextField(blank=True, null=True)
    border_bridge_percent_responsibility = models.TextField(blank=True, null=True)
    border_bridge_structure_number = models.TextField(blank=True, null=True)
    strahnet_highway_designation = models.TextField(blank=True, null=True)
    parallel_structure_designation = models.TextField(blank=True, null=True)
    traffic_direction = models.TextField(blank=True, null=True)
    temporary_structure_designation = models.TextField(blank=True, null=True)
    highway_system = models.TextField(blank=True, null=True)
    federal_lands_highway = models.TextField(blank=True, null=True)
    year_reconstructed = models.IntegerField(blank=True, null=True)
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
    year_of_future_average_daily_traffic = models.IntegerField(blank=True, null=True)
    minimum_navigation_vertical_clearance_vertical_lift_bridge = models.TextField(blank=True, null=True)
    federal_agency = models.TextField(blank=True, null=True)
    submitted_by = models.TextField(blank=True, null=True)
    bridge_condition = models.TextField(blank=True, null=True)
    deck_area = models.TextField(blank=True, null=True)
    state = models.ForeignKey('State', models.DO_NOTHING, blank=True, null=True)
    toll = models.ForeignKey('Toll', models.DO_NOTHING, blank=True, null=True)
    traffic_safety_features_approach_guardrail_ends = models.ForeignKey('TrafficSafetyFeaturesApproachGuardrailEnds', models.DO_NOTHING, blank=True, null=True)
    design_load = models.ForeignKey(DesignLoad, models.DO_NOTHING, blank=True, null=True)
    traffic_safety_features_approach_guardrail = models.ForeignKey('TrafficSafetyFeaturesApproachGuardrail', models.DO_NOTHING, blank=True, null=True)
    deck_condition = models.ForeignKey(DeckCondition, models.DO_NOTHING, blank=True, null=True)
    functional_classification_of_inventory_route = models.ForeignKey(FunctionalClassificationOfInventoryRoute, models.DO_NOTHING, blank=True, null=True)
    historical_significance = models.ForeignKey(HistoricalSignificance, models.DO_NOTHING, blank=True, null=True)
    substructure_condition = models.ForeignKey('SubstructureCondition', models.DO_NOTHING, blank=True, null=True)
    traffic_safety_features_bridge_railings = models.ForeignKey('TrafficSafetyFeaturesBridgeRailings', models.DO_NOTHING, blank=True, null=True)
    superstructure_condition = models.ForeignKey('SuperstructureCondition', models.DO_NOTHING, blank=True, null=True)
    bridge_median = models.ForeignKey(BridgeMedian, models.DO_NOTHING, blank=True, null=True)
    lowest_rating = models.ForeignKey(LowestRating, models.DO_NOTHING, blank=True, null=True)
    owner = models.ForeignKey('Owner', models.DO_NOTHING, blank=True, null=True)
    maintenance_responsibility = models.ForeignKey(MaintenanceResponsibility, models.DO_NOTHING, blank=True, null=True)
    traffic_safety_features_transitions = models.ForeignKey('TrafficSafetyFeaturesTransitions', models.DO_NOTHING, blank=True, null=True)
    structure_kind = models.ForeignKey('StructureKind', models.DO_NOTHING, blank=True, null=True)
    structure_type = models.ForeignKey('StructureType', models.DO_NOTHING, blank=True, null=True)
    type_of_service_on_bridge = models.ForeignKey('TypeOfServiceOnBridge', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nbi'


class NbiRaw(models.Model):
    state = models.TextField(blank=True, null=True)
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
    latitude = models.TextField(blank=True, null=True)
    longitude = models.TextField(blank=True, null=True)
    bypass_detour_length = models.TextField(blank=True, null=True)
    toll = models.TextField(blank=True, null=True)
    maintenance_responsibility = models.TextField(blank=True, null=True)
    owner = models.TextField(blank=True, null=True)
    functional_classification_of_inventory_route = models.TextField(blank=True, null=True)
    year_built = models.TextField(blank=True, null=True)
    traffic_lanes_on_structure = models.TextField(blank=True, null=True)
    traffic_lanes_under_structure = models.TextField(blank=True, null=True)
    average_daily_traffic = models.TextField(blank=True, null=True)
    year_of_average_daily_traffic = models.TextField(blank=True, null=True)
    design_load = models.TextField(blank=True, null=True)
    approach_roadway_width = models.TextField(blank=True, null=True)
    bridge_median = models.TextField(blank=True, null=True)
    skew_angle = models.TextField(blank=True, null=True)
    structure_flared = models.TextField(blank=True, null=True)
    traffic_safety_features_bridge_railings = models.TextField(blank=True, null=True)
    traffic_safety_features_transitions = models.TextField(blank=True, null=True)
    traffic_safety_features_approach_guardrail = models.TextField(blank=True, null=True)
    traffic_safety_features_approach_guardrail_ends = models.TextField(blank=True, null=True)
    historical_significance = models.TextField(blank=True, null=True)
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
    deck_condition = models.TextField(blank=True, null=True)
    superstructure_condition = models.TextField(blank=True, null=True)
    substructure_condition = models.TextField(blank=True, null=True)
    channel_condition = models.TextField(blank=True, null=True)
    culvert_condition = models.TextField(blank=True, null=True)
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
    lowest_rating = models.TextField(blank=True, null=True)
    deck_area = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nbi_raw'


class Owner(models.Model):
    code = models.CharField(unique=True, max_length=2, blank=True, null=True)
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


class StructureKind(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'structure_kind'


class StructureType(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'structure_type'


class SubstructureCondition(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'substructure_condition'


class SuperstructureCondition(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    rating = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'superstructure_condition'


class Toll(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(unique=True, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toll'


class TrafficSafetyFeaturesApproachGuardrail(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_approach_guardrail'


class TrafficSafetyFeaturesApproachGuardrailEnds(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_approach_guardrail_ends'


class TrafficSafetyFeaturesBridgeRailings(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_bridge_railings'


class TrafficSafetyFeaturesTransitions(models.Model):
    code = models.CharField(unique=True, max_length=1, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'traffic_safety_features_transitions'


class TypeOfServiceOnBridge(models.Model):
    code = models.IntegerField(unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'type_of_service_on_bridge'
