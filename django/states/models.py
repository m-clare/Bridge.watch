# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Bridge(models.Model):
    """
    Nbi is the base class containing all field information related to the
    National Bridge Index ASCII files from 2020

    https://www.fhwa.dot.gov/bridge/nbi/ascii2020.cfm

    The encoding of the fields is contained in the following coding guide:

    https://www.fhwa.dot.gov/bridge/mtguide.pdf

    """
    # index or unique key information
    index = models.BigIntegerField(blank=False, null=False, primary_key=True)
    structure_number = models.TextField(
        db_column="STRUCTURE_NUMBER_008", blank=False, null=False
    )  # Field name made lowercase.
    other_state_code = models.TextField(
        db_column="OTHER_STATE_CODE_098A", blank=True, null=True
    )  # Field name made lowercase.
    othr_state_struc_no = models.TextField(
        db_column="OTHR_STATE_STRUC_NO_099", blank=True, null=True
    )  # Field name made lowercase.

    # location information fields
    state_code = models.BigIntegerField(
        db_column="STATE_CODE_001", blank=True, null=True
    )  # Field name made lowercase.
    county_code = models.BigIntegerField(
        db_column="COUNTY_CODE_003", blank=True, null=True
    )  # Field name made lowercase.
    place_code = models.BigIntegerField(
        db_column="PLACE_CODE_004", blank=True, null=True
    )  # Field name made lowercase.

    lat_016 = models.BigIntegerField(
        db_column="LAT_016", blank=True, null=True
    )  # Field name made lowercase.
    latitude = models.FloatField(
        db_column="LAT_016_decimal", blank=True, null=True
    )  # Field name made lowercase.
    long_017 = models.BigIntegerField(
        db_column="LONG_017", blank=True, null=True
    )  # Field name made lowercase.
    longitude = models.FloatField(
        db_column="LONG_017_decimal", blank=True, null=True
    )  # Field name made lowercase.

    # bridge condition fields
    bridge_condition = models.TextField(
        db_column="BRIDGE_CONDITION", blank=True, null=True
    )  # Field name made lowercase.
    rating = models.IntegerField(
        db_column="LOWEST_RATING", blank=True, null=True
    )  # Field name made lowercase.
    deck_cond = models.TextField(
        db_column="DECK_COND_058", blank=True, null=True
    )  # Field name made lowercase.
    channel_cond = models.TextField(
        db_column="CHANNEL_COND_061", blank=True, null=True
    )  # Field name made lowercase.
    culvert_cond = models.TextField(
        db_column="CULVERT_COND_062", blank=True, null=True
    )  # Field name made lowercase.
    substructure_cond = models.TextField(
        db_column="SUBSTRUCTURE_COND_060", blank=True, null=True
    )  # Field name made lowercase.
    superstructure_cond = models.TextField(
        db_column="SUPERSTRUCTURE_COND_059", blank=True, null=True
    )  # Field name made lowercase.

    # inspection information
    date_of_inspect = models.DateField(
        db_column="DATE_OF_INSPECT_090", blank=True, null=True
    )  # Field name made lowercase.
    year_of_inspect = models.IntegerField(
        db_column="YEAR_OF_INSPECT_090", blank=True, null=True
    )  # Field name made lowercase.
    inspect_freq_months = models.IntegerField(
        db_column="INSPECT_FREQ_MONTHS_091", blank=True, null=True
    )  # Field name made lowercase.
    fracture = models.TextField(
        db_column="FRACTURE_092A", blank=True, null=True
    )  # Field name made lowercase.
    fracture_last_date = models.DateField(
        db_column="FRACTURE_LAST_DATE_093A", blank=True, null=True
    )  # Field name made lowercase.
    fracture_last_year = models.IntegerField(
        db_column="FRACTURE_LAST_YEAR_093A", blank=True, null=True
    )  # Field name made lowercase.
    spec_inspect = models.TextField(
        db_column="SPEC_INSPECT_092C", blank=True, null=True
    )  # Field name made lowercase.
    spec_last_date = models.DateField(
        db_column="SPEC_LAST_DATE_093C", blank=True, null=True
    )  # Field name made lowercase.
    spec_last_year = models.IntegerField(
        db_column="SPEC_LAST_YEAR_093C", blank=True, null=True
    )  # Field name made lowercase.
    undwater_last_date = models.DateField(
        db_column="UNDWATER_LAST_DATE_093B", blank=True, null=True
    )  # Field name made lowercase.
    undwater_last_year = models.IntegerField(
        db_column="UNDWATER_LAST_YEAR_093B", blank=True, null=True
    )  # Field name made lowercase.
    undwater_look_see = models.TextField(
        db_column="UNDWATER_LOOK_SEE_092B", blank=True, null=True
    )  # Field name made lowercase.

    # traffic values
    adt = models.IntegerField(
        db_column="ADT_029", blank=True, null=True
    )  # Field name made lowercase.
    year_adt = models.IntegerField(
        db_column="YEAR_ADT_030", blank=True, null=True
    )  # Field name made lowercase.
    percent_adt_truck = models.IntegerField(
        db_column="PERCENT_ADT_TRUCK_109", blank=True, null=True
    )  # Field name made lowercase.
    future_adt = models.IntegerField(
        db_column="FUTURE_ADT_114", blank=True, null=True
    )  # Field name made lowercase.
    year_of_future_adt = models.IntegerField(
        db_column="YEAR_OF_FUTURE_ADT_115", blank=True, null=True
    )  # Field name made lowercase.

    # bridge classification
    structure_kind = models.TextField(
        db_column="STRUCTURE_KIND_043A", blank=True, null=True
    )  # Field name made lowercase.
    structure_type = models.TextField(
        db_column="STRUCTURE_TYPE_043B", blank=True, null=True
    )  # Field name made lowercase.
    history = models.IntegerField(
        db_column="HISTORY_037", blank=True, null=True
    )  # Field name made lowercase.

    # bridge physical attributes
    deck_area = models.FloatField(
        db_column="DECK_AREA", blank=True, null=True
    )  # Field name made lowercase.
    degrees_skew = models.IntegerField(
        db_column="DEGREES_SKEW_034", blank=True, null=True
    )  # Field name made lowercase.
    deck_width_mt = models.FloatField(
        db_column="DECK_WIDTH_MT_052", blank=True, null=True
    )  # Field name made lowercase.

    # approach information
    appr_kind = models.FloatField(
        db_column="APPR_KIND_044A", blank=True, null=True
    )  # Field name made lowercase.
    appr_rail = models.TextField(
        db_column="APPR_RAIL_036C", blank=True, null=True
    )  # Field name made lowercase.
    appr_rail_end = models.TextField(
        db_column="APPR_RAIL_END_036D", blank=True, null=True
    )  # Field name made lowercase.
    appr_road_eval = models.FloatField(
        db_column="APPR_ROAD_EVAL_072", blank=True, null=True
    )  # Field name made lowercase.
    appr_spans = models.IntegerField(
        db_column="APPR_SPANS_046", blank=True, null=True
    )  # Field name made lowercase.
    appr_type = models.FloatField(
        db_column="APPR_TYPE_044B", blank=True, null=True
    )  # Field name made lowercase.
    appr_width_mt = models.FloatField(
        db_column="APPR_WIDTH_MT_032", blank=True, null=True
    )  # Field name made lowercase.
    base_hwy_network = models.FloatField(
        db_column="BASE_HWY_NETWORK_012", blank=True, null=True
    )  # Field name made lowercase.

    bridge_imp_cost = models.IntegerField(
        db_column="BRIDGE_IMP_COST_094", blank=True, null=True
    )  # Field name made lowercase.
    bridge_len_ind = models.TextField(
        db_column="BRIDGE_LEN_IND_112", blank=True, null=True
    )  # Field name made lowercase.

    critical_facility = models.FloatField(
        db_column="CRITICAL_FACILITY_006B", blank=True, null=True
    )  # Field name made lowercase.

    deck_geometry_eval = models.TextField(
        db_column="DECK_GEOMETRY_EVAL_068", blank=True, null=True
    )  # Field name made lowercase.
    deck_protection = models.TextField(
        db_column="DECK_PROTECTION_108C", blank=True, null=True
    )  # Field name made lowercase.
    deck_structure_type = models.TextField(
        db_column="DECK_STRUCTURE_TYPE_107", blank=True, null=True
    )  # Field name made lowercase.

    design_load = models.TextField(
        db_column="DESIGN_LOAD_031", blank=True, null=True
    )  # Field name made lowercase.
    detour_kilos = models.IntegerField(
        db_column="DETOUR_KILOS_019", blank=True, null=True
    )  # Field name made lowercase.
    direction = models.FloatField(
        db_column="DIRECTION_005E", blank=True, null=True
    )  # Field name made lowercase.
    facility_carried = models.TextField(
        db_column="FACILITY_CARRIED_007", blank=True, null=True
    )  # Field name made lowercase.
    features_desc = models.TextField(
        db_column="FEATURES_DESC_006A", blank=True, null=True
    )  # Field name made lowercase.
    federal_lands = models.FloatField(
        db_column="FEDERAL_LANDS_105", blank=True, null=True
    )  # Field name made lowercase.
    fed_agency = models.TextField(
        db_column="FED_AGENCY", blank=True, null=True
    )  # Field name made lowercase.

    functional_class = models.FloatField(
        db_column="FUNCTIONAL_CLASS_026", blank=True, null=True
    )  # Field name made lowercase.

    highway_district = models.TextField(
        db_column="HIGHWAY_DISTRICT_002", blank=True, null=True
    )  # Field name made lowercase.
    highway_system = models.FloatField(
        db_column="HIGHWAY_SYSTEM_104", blank=True, null=True
    )  # Field name made lowercase.

    horr_clr_mt = models.FloatField(
        db_column="HORR_CLR_MT_047", blank=True, null=True
    )  # Field name made lowercase.
    imp_len_mt = models.FloatField(
        db_column="IMP_LEN_MT_076", blank=True, null=True
    )  # Field name made lowercase.

    inventory_rating = models.FloatField(
        db_column="INVENTORY_RATING_066", blank=True, null=True
    )  # Field name made lowercase.
    inv_rating_meth = models.TextField(
        db_column="INV_RATING_METH_065", blank=True, null=True
    )  # Field name made lowercase.
    kilopoint = models.FloatField(
        db_column="KILOPOINT_011", blank=True, null=True
    )  # Field name made lowercase.
    lat_und_mt = models.FloatField(
        db_column="LAT_UND_MT_055B", blank=True, null=True
    )  # Field name made lowercase.
    lat_und_ref = models.TextField(
        db_column="LAT_UND_REF_055A", blank=True, null=True
    )  # Field name made lowercase.
    left_curb_mt = models.FloatField(
        db_column="LEFT_CURB_MT_050A", blank=True, null=True
    )  # Field name made lowercase.
    left_lat_und_mt = models.FloatField(
        db_column="LEFT_LAT_UND_MT_056", blank=True, null=True
    )  # Field name made lowercase.
    location = models.TextField(
        db_column="LOCATION_009", blank=True, null=True
    )  # Field name made lowercase.

    lrs_inv_route = models.TextField(
        db_column="LRS_INV_ROUTE_013A", blank=True, null=True
    )  # Field name made lowercase.
    maintenance = models.FloatField(
        db_column="MAINTENANCE_021", blank=True, null=True
    )  # Field name made lowercase.
    main_unit_spans = models.IntegerField(
        db_column="MAIN_UNIT_SPANS_045", blank=True, null=True
    )  # Field name made lowercase.
    max_span_len_mt = models.FloatField(
        db_column="MAX_SPAN_LEN_MT_048", blank=True, null=True
    )  # Field name made lowercase.
    median_code = models.FloatField(
        db_column="MEDIAN_CODE_033", blank=True, null=True
    )  # Field name made lowercase.
    membrane_type = models.TextField(
        db_column="MEMBRANE_TYPE_108B", blank=True, null=True
    )  # Field name made lowercase.
    min_nav_clr_mt = models.FloatField(
        db_column="MIN_NAV_CLR_MT_116", blank=True, null=True
    )  # Field name made lowercase.
    min_vert_clr = models.FloatField(
        db_column="MIN_VERT_CLR_010", blank=True, null=True
    )  # Field name made lowercase.
    national_network = models.FloatField(
        db_column="NATIONAL_NETWORK_110", blank=True, null=True
    )  # Field name made lowercase.
    navigation = models.TextField(
        db_column="NAVIGATION_038", blank=True, null=True
    )  # Field name made lowercase.
    nav_horr_clr_mt = models.FloatField(
        db_column="NAV_HORR_CLR_MT_040", blank=True, null=True
    )  # Field name made lowercase.
    nav_vert_clr_mt = models.FloatField(
        db_column="NAV_VERT_CLR_MT_039", blank=True, null=True
    )  # Field name made lowercase.
    open_closed_posted = models.TextField(
        db_column="OPEN_CLOSED_POSTED_041", blank=True, null=True
    )  # Field name made lowercase.
    operating_rating = models.FloatField(
        db_column="OPERATING_RATING_064", blank=True, null=True
    )  # Field name made lowercase.
    opr_rating_meth = models.TextField(
        db_column="OPR_RATING_METH_063", blank=True, null=True
    )  # Field name made lowercase.

    other_state_pcnt = models.IntegerField(
        db_column="OTHER_STATE_PCNT_098B", blank=True, null=True
    )  # Field name made lowercase.

    owner = models.FloatField(
        db_column="OWNER_022", blank=True, null=True
    )  # Field name made lowercase.
    parallel_structure = models.TextField(
        db_column="PARALLEL_STRUCTURE_101", blank=True, null=True
    )  # Field name made lowercase.

    pier_protection = models.IntegerField(
        db_column="PIER_PROTECTION_111", blank=True, null=True
    )  # Field name made lowercase.

    posting_eval = models.FloatField(
        db_column="POSTING_EVAL_070", blank=True, null=True
    )  # Field name made lowercase.
    railings = models.TextField(
        db_column="RAILINGS_036A", blank=True, null=True
    )  # Field name made lowercase.
    record_type = models.TextField(
        db_column="RECORD_TYPE_005A", blank=True, null=True
    )  # Field name made lowercase.
    right_curb_mt = models.FloatField(
        db_column="RIGHT_CURB_MT_050B", blank=True, null=True
    )  # Field name made lowercase.
    roadway_imp_cost = models.IntegerField(
        db_column="ROADWAY_IMP_COST_095", blank=True, null=True
    )  # Field name made lowercase.
    roadway_width_mt = models.FloatField(
        db_column="ROADWAY_WIDTH_MT_051", blank=True, null=True
    )  # Field name made lowercase.
    route_number = models.TextField(
        db_column="ROUTE_NUMBER_005D", blank=True, null=True
    )  # Field name made lowercase.
    route_prefix = models.FloatField(
        db_column="ROUTE_PREFIX_005B", blank=True, null=True
    )  # Field name made lowercase.
    scour_critical = models.TextField(
        db_column="SCOUR_CRITICAL_113", blank=True, null=True
    )  # Field name made lowercase.
    service_level = models.FloatField(
        db_column="SERVICE_LEVEL_005C", blank=True, null=True
    )  # Field name made lowercase.
    service_on = models.FloatField(
        db_column="SERVICE_ON_042A", blank=True, null=True
    )  # Field name made lowercase.
    service_und = models.FloatField(
        db_column="SERVICE_UND_042B", blank=True, null=True
    )  # Field name made lowercase.

    strahnet_highway = models.FloatField(
        db_column="STRAHNET_HIGHWAY_100", blank=True, null=True
    )  # Field name made lowercase.
    structural_eval = models.TextField(
        db_column="STRUCTURAL_EVAL_067", blank=True, null=True
    )  # Field name made lowercase.
    structure_flared = models.FloatField(
        db_column="STRUCTURE_FLARED_035", blank=True, null=True
    )  # Field name made lowercase.

    structure_len_mt = models.FloatField(
        db_column="STRUCTURE_LEN_MT_049", blank=True, null=True
    )  # Field name made lowercase.

    submitted_by = models.BigIntegerField(
        db_column="SUBMITTED_BY", blank=True, null=True
    )  # Field name made lowercase.
    subroute_no = models.FloatField(
        db_column="SUBROUTE_NO_013B", blank=True, null=True
    )  # Field name made lowercase.

    surface_type = models.TextField(
        db_column="SURFACE_TYPE_108A", blank=True, null=True
    )  # Field name made lowercase.
    temp_structure = models.TextField(
        db_column="TEMP_STRUCTURE_103", blank=True, null=True
    )  # Field name made lowercase.
    toll = models.FloatField(
        db_column="TOLL_020", blank=True, null=True
    )  # Field name made lowercase.
    total_imp_cost = models.IntegerField(
        db_column="TOTAL_IMP_COST_096", blank=True, null=True
    )  # Field name made lowercase.
    traffic_direction = models.FloatField(
        db_column="TRAFFIC_DIRECTION_102", blank=True, null=True
    )  # Field name made lowercase.
    traffic_lanes_on = models.IntegerField(
        db_column="TRAFFIC_LANES_ON_028A", blank=True, null=True
    )  # Field name made lowercase.
    traffic_lanes_under = models.IntegerField(
        db_column="TRAFFIC_LANES_UND_028B", blank=True, null=True
    )  # Field name made lowercase.
    transitions = models.TextField(
        db_column="TRANSITIONS_036B", blank=True, null=True
    )  # Field name made lowercase.
    underclearence_eval = models.TextField(
        db_column="UNDCLRENCE_EVAL_069", blank=True, null=True
    )  # Field name made lowercase.

    vert_clr_over_mt = models.FloatField(
        db_column="VERT_CLR_OVER_MT_053", blank=True, null=True
    )  # Field name made lowercase.
    vert_clr_und = models.FloatField(
        db_column="VERT_CLR_UND_054B", blank=True, null=True
    )  # Field name made lowercase.
    vert_clr_und_ref = models.TextField(
        db_column="VERT_CLR_UND_REF_054A", blank=True, null=True
    )  # Field name made lowercase.
    waterway_eval = models.TextField(
        db_column="WATERWAY_EVAL_071", blank=True, null=True
    )  # Field name made lowercase.
    work_done_by = models.FloatField(
        db_column="WORK_DONE_BY_075B", blank=True, null=True
    )  # Field name made lowercase.
    work_proposed = models.FloatField(
        db_column="WORK_PROPOSED_075A", blank=True, null=True
    )  # Field name made lowercase.

    year_built = models.IntegerField(
        db_column="YEAR_BUILT_027", blank=True, null=True
    )  # Field name made lowercase.

    year_of_imp = models.IntegerField(
        db_column="YEAR_OF_IMP_097", blank=True, null=True
    )  # Field name made lowercase.

    year_reconstructed = models.IntegerField(
        db_column="YEAR_RECONSTRUCTED_106", blank=True, null=True
    )  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "nbi"

    def __str__(self):
        return self.structure_number

    objects = models.Manager()

