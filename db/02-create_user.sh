#!/bin/bash

psql -U $POSTGRES_USER -d $POSTGRES_DB <<EOF
CREATE USER $READONLY_USER WITH PASSWORD '$READONLY_PASSWORD';
GRANT CONNECT ON DATABASE $SQL_DATABASE TO $READONLY_USER;
GRANT USAGE ON SCHEMA public TO $READONLY_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO $READONLY_USER;
EOF
