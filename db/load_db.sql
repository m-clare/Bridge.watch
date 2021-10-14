DROP TABLE IF EXISTS nbi;
DROP TABLE IF EXISTS nbi_raw;
CREATE TABLE nbi_raw (
  id SERIAL,
  state TEXT,
  structure_number TEXT,
  inventory_route_record_type TEXT,
  inventory_route_route_signing_prefix TEXT,
  inventory_route_designated_level_of_service TEXT,
  inventory_route_number TEXT,
  inventory_route_direction TEXT,
  highway_agency_district TEXT,
  county_code TEXT,
  place_code TEXT,
  features_intersected TEXT,
  critical_facility TEXT,
  facility_carried TEXT,
  location TEXT,
  inventory_route_minimum_vertical_clearance TEXT,
  kilometerpoint TEXT,
  base_highway_network TEXT,
  lrs_inventory_route TEXT,
  subroute_number TEXT,
  latitude TEXT,
  longitude TEXT,
  bypass_detour_length TEXT,
  toll TEXT,
  maintenance_responsibility TEXT,
  owner TEXT,
  functional_classification_of_inventory_route TEXT,
  year_bult TEXT,
  traffic_lanes_on_structure TEXT,
  traffic_lanes_under_structure TEXT,
  average_daily_traffic TEXT,
  year_of_average_daily_traffic TEXT,
  design_load TEXT,
  approach_roadway_width TEXT,
  bridge_median TEXT,
  skew_angle TEXT,
  structure_flared TEXT,
  traffic_safety_features_bridge_railings TEXT,
  traffic_safety_features_transitions TEXT,
  traffic_safety_features_approach_guardrail TEXT,
  traffic_safety_features_approach_guardrail_ends TEXT,
  historical_significance TEXT,
  navigation_control TEXT,
  navigation_vertical_clearance TEXT,
  navigation_horizontal_clearance TEXT,
  structure_open_posted_closed_to_traffic TEXT,
  type_of_service_on_bridge TEXT,
  type_of_service_under_bridge TEXT,
  structure_kind TEXT,
  structure_type TEXT,
  structure_type_approach_spans_material TEXT,
  structure_type_approach_design TEXT,
  main_unit_span_number TEXT,
  number_of_approach_spans TEXT,
  inventory_route_total_horizontal_clearance TEXT,
  maximum_span_length TEXT,
  structure_length TEXT,
  left_curb_width TEXT,
  right_curb_width TEXT,
  bridge_roadway_width TEXT,
  deck_width TEXT,
  minimum_vertical_clearance_over_bridge_roadway TEXT,
  minimum_vertical_underclearance_reference_feature TEXT,
  minimum_vertical_underclearance TEXT,
  minimum_lateral_underclearance_on_right TEXT,
  minimum_lateral_underclearance_reference_feature TEXT,
  minimum_lateral_underclearance_on_left TEXT,
  deck_condition TEXT,
  superstructure_condition TEXT,
  substructure_condition TEXT,
  channel_condition TEXT,
  culvert_condition TEXT,
  operating_rating_method TEXT,
  operating_rating TEXT,
  inventory_rating_method TEXT,
  inventory_rating TEXT,
  structural_evaluation TEXT,
  deck_geometry_evaluation TEXT,
  underclearance_evaluation TEXT,
  posting_evaluation TEXT,
  waterway_evaluation TEXT,
  approach_roadway_alignment TEXT,
  type_of_work_proposed TEXT,
  type_of_work_done_by TEXT,
  length_of_structure_improvement TEXT,
  date_of_inspection TEXT,
  designated_inspection_frequency TEXT,
  critical_feature_inspection_fracture TEXT,
  critical_feature_inspection_underwater TEXT,
  critical_feature_inspection_other_special TEXT,
  critical_feature_inspection_fracture_date TEXT,
  critical_feature_inspection_underwater_date TEXT,
  critical_feature_inspection_other_special_date TEXT,
  bridge_improvement_cost TEXT,
  roadway_improvement_cost TEXT,
  total_project_improvement_cost TEXT,
  year_of_improvement_cost_estimate TEXT,
  border_bridge_neighboring_state_code TEXT,
  border_bridge_percent_responsibility TEXT,
  border_bridge_structure_number TEXT,
  STRAHNET_highway_designation TEXT,
  parallel_structure_designation TEXT,
  traffic_direction TEXT,
  temporary_structure_designation TEXT,
  highway_system TEXT,
  federal_lands_highway TEXT,
  year_reconstructed TEXT,
  deck_structure_type TEXT,
  deck_wearing_surface_type TEXT,
  deck_wearing_surface_membrane_type TEXT,
  wearing_surface_deck_protection TEXT,
  average_daily_truck_traffic TEXT,
  national_network TEXT,
  pier_or_abutment_protection TEXT,
  NBIS_bridge_length TEXT,
  scour_critical TEXT,
  future_average_daily_traffic TEXT,
  year_of_future_average_daily_traffic TEXT,
  minimum_navigation_vertical_clearance_vertical_lift_bridge TEXT,
  federal_agency TEXT,
  submitted_by TEXT,
  bridge_condition TEXT,
  lowest_rating TEXT,
  deck_area TEXT,
  PRIMARY KEY (id)
);

\copy nbi_raw(state,structure_number,inventory_route_record_type,inventory_route_route_signing_prefix,inventory_route_designated_level_of_service,inventory_route_number,inventory_route_direction,highway_agency_district,county_code,place_code,features_intersected,critical_facility,facility_carried,location,inventory_route_minimum_vertical_clearance,kilometerpoint,base_highway_network,lrs_inventory_route,subroute_number,latitude,longitude,bypass_detour_length,toll,maintenance_responsibility,owner,functional_classification_of_inventory_route,year_bult,traffic_lanes_on_structure,traffic_lanes_under_structure,average_daily_traffic,year_of_average_daily_traffic,design_load,approach_roadway_width,bridge_median,skew_angle,structure_flared,traffic_safety_features_bridge_railings,traffic_safety_features_transitions,traffic_safety_features_approach_guardrail,traffic_safety_features_approach_guardrail_ends,historical_significance,navigation_control,navigation_vertical_clearance,navigation_horizontal_clearance,structure_open_posted_closed_to_traffic,type_of_service_on_bridge,type_of_service_under_bridge,structure_kind,structure_type,structure_type_approach_spans_material,structure_type_approach_design,main_unit_span_number,number_of_approach_spans,inventory_route_total_horizontal_clearance,maximum_span_length,structure_length,left_curb_width,right_curb_width,bridge_roadway_width,deck_width,minimum_vertical_clearance_over_bridge_roadway,minimum_vertical_underclearance_reference_feature,minimum_vertical_underclearance,minimum_lateral_underclearance_on_right,minimum_lateral_underclearance_reference_feature,minimum_lateral_underclearance_on_left,deck_condition,superstructure_condition,substructure_condition,channel_condition,culvert_condition,operating_rating_method,operating_rating,inventory_rating_method,inventory_rating,structural_evaluation,deck_geometry_evaluation,underclearance_evaluation,posting_evaluation,waterway_evaluation,approach_roadway_alignment,type_of_work_proposed,type_of_work_done_by,length_of_structure_improvement,date_of_inspection,designated_inspection_frequency,critical_feature_inspection_fracture,critical_feature_inspection_underwater,critical_feature_inspection_other_special,critical_feature_inspection_fracture_date,critical_feature_inspection_underwater_date,critical_feature_inspection_other_special_date,bridge_improvement_cost,roadway_improvement_cost,total_project_improvement_cost,year_of_improvement_cost_estimate,border_bridge_neighboring_state_code,border_bridge_percent_responsibility,border_bridge_structure_number,STRAHNET_highway_designation,parallel_structure_designation,traffic_direction,temporary_structure_designation,highway_system,federal_lands_highway,year_reconstructed,deck_structure_type,deck_wearing_surface_type,deck_wearing_surface_membrane_type,wearing_surface_deck_protection,average_daily_truck_traffic,national_network,pier_or_abutment_protection,NBIS_bridge_length,scour_critical,future_average_daily_traffic,year_of_future_average_daily_traffic,minimum_navigation_vertical_clearance_vertical_lift_bridge,federal_agency,submitted_by,bridge_condition,lowest_rating,deck_area) FROM './db/2020AllRecordsDelimitedAllStatesClean.csv' WITH DELIMITER ',' CSV HEADER NULL as 'NULL';

-- Create table for actual data querying
CREATE TABLE nbi AS (SELECT * from nbi_raw);

-- Drop unneeded structure types - no culverts or tunnels
DELETE FROM nbi WHERE structure_type IN ('18', '19');
DELETE FROM nbi WHERE structure_type IS NULL;
ALTER TABLE nbi DROP COLUMN culvert_condition;

ALTER TABLE nbi ALTER COLUMN latitude TYPE DOUBLE PRECISION USING latitude::double precision;
ALTER TABLE nbi ALTER COLUMN longitude TYPE DOUBLE PRECISION USING longitude::double precision;

DROP TABLE IF EXISTS state;
CREATE TABLE state (
  id SERIAL,
  name VARCHAR(24) UNIQUE NOT NULL,
  fips_code CHAR(2) UNIQUE,
  PRIMARY KEY(id)
  );

\copy state(name, fips_code) FROM './db/fk_csvs/state.csv' WITH DELIMITER ',' CSV HEADER ;

ALTER TABLE nbi ADD COLUMN state_id INTEGER REFERENCES state(id) ON DELETE CASCADE;
UPDATE nbi SET state_id = (SELECT state.id FROM state WHERE state.fips_code = nbi.state);
ALTER TABLE nbi DROP COLUMN state;

DROP TABLE IF EXISTS toll;
CREATE TABLE toll (
  id SERIAL,
  code CHAR(1) UNIQUE,
  description TEXT UNIQUE,
  PRIMARY KEY(id)
  );

\copy toll(code,description) from './db/fk_csvs/toll.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN toll_id INTEGER REFERENCES toll(id) ON DELETE CASCADE;
UPDATE nbi SET toll_id = (SELECT toll.id FROM toll WHERE toll.code = nbi.toll);
ALTER TABLE nbi DROP COLUMN toll;

DROP TABLE IF EXISTS traffic_safety_features_approach_guardrail_ends;
CREATE TABLE traffic_safety_features_approach_guardrail_ends (
id SERIAL,
 code CHAR(1) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy traffic_safety_features_approach_guardrail_ends(code,description) FROM './db/fk_csvs/traffic_safety_features_approach_guardrail_ends.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN traffic_safety_features_approach_guardrail_ends_id INTEGER REFERENCES traffic_safety_features_approach_guardrail_ends(id) ON DELETE CASCADE;
UPDATE nbi SET traffic_safety_features_approach_guardrail_ends_id = (SELECT traffic_safety_features_approach_guardrail_ends.id FROM traffic_safety_features_approach_guardrail_ends where traffic_safety_features_approach_guardrail_ends.code = nbi.traffic_safety_features_approach_guardrail_ends);
ALTER TABLE nbi DROP COLUMN traffic_safety_features_approach_guardrail_ends;

DROP TABLE IF EXISTS design_load;
CREATE TABLE design_load (
id SERIAL,
 code CHAR(1) UNIQUE,
 metric_description TEXT,
 english_description TEXT,
 PRIMARY KEY (id)
 );

\copy design_load(code,metric_description,english_description) FROM './db/fk_csvs/design_load.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN design_load_id INTEGER REFERENCES design_load(id) ON DELETE CASCADE;
UPDATE nbi SET design_load_id = (SELECT design_load.id FROM design_load where design_load.code = nbi.design_load);
ALTER TABLE nbi DROP COLUMN design_load;

DROP TABLE IF EXISTS traffic_safety_features_approach_guardrail;
CREATE TABLE traffic_safety_features_approach_guardrail (
id SERIAL,
 code CHAR(1) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy traffic_safety_features_approach_guardrail(code,description) FROM './db/fk_csvs/traffic_safety_features_approach_guardrail.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN traffic_safety_features_approach_guardrail_id INTEGER REFERENCES traffic_safety_features_approach_guardrail(id) ON DELETE CASCADE;
UPDATE nbi SET traffic_safety_features_approach_guardrail_id = (SELECT traffic_safety_features_approach_guardrail.id FROM traffic_safety_features_approach_guardrail where traffic_safety_features_approach_guardrail.code = nbi.traffic_safety_features_approach_guardrail);
ALTER TABLE nbi DROP COLUMN traffic_safety_features_approach_guardrail;

DROP TABLE IF EXISTS deck_condition;
CREATE TABLE deck_condition (
id SERIAL,
 code INTEGER UNIQUE,
 rating TEXT,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy deck_condition(code,rating,description) FROM './db/fk_csvs/deck_condition.csv' WITH DELIMITER ',' CSV HEADER;

UPDATE nbi SET deck_condition = NULL WHERE deck_condition = 'N';
ALTER TABLE nbi ADD COLUMN deck_condition_id INTEGER REFERENCES deck_condition(id) ON DELETE CASCADE;
UPDATE nbi SET deck_condition_id = (SELECT deck_condition.id FROM deck_condition where deck_condition.code = nbi.deck_condition::INTEGER);
ALTER TABLE nbi DROP COLUMN deck_condition;

DROP TABLE IF EXISTS functional_classification_of_inventory_route;
CREATE TABLE functional_classification_of_inventory_route (
id SERIAL,
 code CHAR(2) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy functional_classification_of_inventory_route(code,description) FROM './db/fk_csvs/functional_classification_of_inventory_route.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN functional_classification_of_inventory_route_id INTEGER REFERENCES functional_classification_of_inventory_route(id) ON DELETE CASCADE;
UPDATE nbi SET functional_classification_of_inventory_route_id = (SELECT functional_classification_of_inventory_route.id FROM functional_classification_of_inventory_route where functional_classification_of_inventory_route.code = nbi.functional_classification_of_inventory_route);
ALTER TABLE nbi DROP COLUMN functional_classification_of_inventory_route;

DROP TABLE IF EXISTS historical_significance;
CREATE TABLE historical_significance (
id SERIAL,
 code CHAR(1) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy historical_significance(code,description) FROM './db/fk_csvs/historical_significance.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN historical_significance_id INTEGER REFERENCES historical_significance(id) ON DELETE CASCADE;
UPDATE nbi SET historical_significance_id = (SELECT historical_significance.id FROM historical_significance where historical_significance.code = nbi.historical_significance);
ALTER TABLE nbi DROP COLUMN historical_significance;

DROP TABLE IF EXISTS substructure_condition;
CREATE TABLE substructure_condition (
id SERIAL,
 code INTEGER UNIQUE,
 rating TEXT,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy substructure_condition(code,rating,description) FROM './db/fk_csvs/substructure_condition.csv' WITH DELIMITER ',' CSV HEADER;

UPDATE nbi SET substructure_condition = NULL WHERE substructure_condition = 'N';

ALTER TABLE nbi ADD COLUMN substructure_condition_id INTEGER REFERENCES substructure_condition(id) ON DELETE CASCADE;
UPDATE nbi SET substructure_condition_id = (SELECT substructure_condition.id FROM substructure_condition where substructure_condition.code = nbi.substructure_condition::INTEGER);
ALTER TABLE nbi DROP COLUMN substructure_condition;

DROP TABLE IF EXISTS traffic_safety_features_bridge_railings ;
CREATE TABLE traffic_safety_features_bridge_railings (
id SERIAL,
 code CHAR(1) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy traffic_safety_features_bridge_railings(code,description) FROM './db/fk_csvs/traffic_safety_features_bridge_railings.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN traffic_safety_features_bridge_railings_id INTEGER REFERENCES traffic_safety_features_bridge_railings(id) ON DELETE CASCADE;
UPDATE nbi SET traffic_safety_features_bridge_railings_id = (SELECT traffic_safety_features_bridge_railings.id FROM traffic_safety_features_bridge_railings where traffic_safety_features_bridge_railings.code = nbi.traffic_safety_features_bridge_railings);
ALTER TABLE nbi DROP COLUMN traffic_safety_features_bridge_railings;

DROP TABLE IF EXISTS superstructure_condition;
CREATE TABLE superstructure_condition (
id SERIAL,
 code INTEGER UNIQUE,
 rating TEXT,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy superstructure_condition(code,rating,description) FROM './db/fk_csvs/superstructure_condition.csv' WITH DELIMITER ',' CSV HEADER;

UPDATE nbi SET superstructure_condition = NULL WHERE superstructure_condition = 'N';

ALTER TABLE nbi ADD COLUMN superstructure_condition_id INTEGER REFERENCES superstructure_condition(id) ON DELETE CASCADE;
UPDATE nbi SET superstructure_condition_id = (SELECT superstructure_condition.id FROM superstructure_condition where superstructure_condition.code = nbi.superstructure_condition::INTEGER);
ALTER TABLE nbi DROP COLUMN superstructure_condition;

DROP TABLE IF EXISTS bridge_median;
CREATE TABLE bridge_median (
id SERIAL,
 code CHAR(1) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy bridge_median(code,description) FROM './db/fk_csvs/bridge_median.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN bridge_median_id INTEGER REFERENCES bridge_median(id) ON DELETE CASCADE;
UPDATE nbi SET bridge_median_id = (SELECT bridge_median.id FROM bridge_median where bridge_median.code = nbi.bridge_median);
ALTER TABLE nbi DROP COLUMN bridge_median;

DROP TABLE IF EXISTS lowest_rating;
CREATE TABLE lowest_rating (
id SERIAL,
 code INTEGER UNIQUE,
 rating TEXT,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy lowest_rating(code,rating,description) FROM './db/fk_csvs/lowest_rating.csv' WITH DELIMITER ',' CSV HEADER;

UPDATE nbi SET lowest_rating = NULL WHERE lowest_rating = 'N';

ALTER TABLE nbi ADD COLUMN lowest_rating_id INTEGER REFERENCES lowest_rating(id) ON DELETE CASCADE;
UPDATE nbi SET lowest_rating_id = (SELECT lowest_rating.id FROM lowest_rating where lowest_rating.code = nbi.lowest_rating::INTEGER);
ALTER TABLE nbi DROP COLUMN lowest_rating;

DROP TABLE IF EXISTS owner;
CREATE TABLE owner (
id SERIAL,
 code CHAR(2) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy owner(code,description) FROM './db/fk_csvs/owner.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN owner_id INTEGER REFERENCES owner(id) ON DELETE CASCADE;
UPDATE nbi SET owner_id = (SELECT owner.id FROM owner where owner.code = nbi.owner);
ALTER TABLE nbi DROP COLUMN owner;

DROP TABLE IF EXISTS maintenance_responsibility;
CREATE TABLE maintenance_responsibility (
id SERIAL,
 code CHAR(2) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy maintenance_responsibility(code,description) FROM './db/fk_csvs/maintenance_responsibility.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN maintenance_responsibility_id INTEGER REFERENCES maintenance_responsibility(id) ON DELETE CASCADE;
UPDATE nbi SET maintenance_responsibility_id = (SELECT maintenance_responsibility.id FROM maintenance_responsibility where maintenance_responsibility.code = nbi.maintenance_responsibility);
ALTER TABLE nbi DROP COLUMN maintenance_responsibility;

DROP TABLE IF EXISTS culvert_condition;
CREATE TABLE culvert_condition (
id SERIAL,
 code INTEGER UNIQUE,
 rating TEXT,
 description TEXT,
 PRIMARY KEY (id)
 );

DROP TABLE IF EXISTS traffic_safety_features_transitions;
CREATE TABLE traffic_safety_features_transitions (
id SERIAL,
 code CHAR(1) UNIQUE,
 description TEXT,
 PRIMARY KEY (id)
 );

\copy traffic_safety_features_transitions(code,description) FROM './db/fk_csvs/traffic_safety_features_transitions.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE nbi ADD COLUMN traffic_safety_features_transitions_id INTEGER REFERENCES traffic_safety_features_transitions(id) ON DELETE CASCADE;
UPDATE nbi SET traffic_safety_features_transitions_id = (SELECT traffic_safety_features_transitions.id FROM traffic_safety_features_transitions where traffic_safety_features_transitions.code = nbi.traffic_safety_features_transitions);
ALTER TABLE nbi DROP COLUMN traffic_safety_features_transitions;

ALTER TABLE nbi RENAME TO nbi;

-- Fix data types
ALTER TABLE nbi ALTER COLUMN features_intersected SET DATA TYPE VARCHAR(28);

-- CREATE TABLE abbrev_rating AS SELECT structure_number, state_id, latitude, longitude, structure_type, lowest_rating from nbi;
-- DELETE FROM abbrev_rating WHERE not (abbrev_rating IS NOT NULL);
-- ALTER TABLE abbrev_rating ADD COLUMN id SERIAL PRIMARY KEY;
-- ALTER TABLE abbrev_rating ADD CONSTRAINT lowest_rating_id FOREIGN KEY (lowest_rating_id) REFERENCES lowest_rating(id);
-- ALTER TABLE abbrev_rating ADD CONSTRAINT state_id FOREIGN KEY (state_id) REFERENCES state(id);
--  DELETE FROM abbrev_rating WHERE structure_type IN ('00', '18', '19');

