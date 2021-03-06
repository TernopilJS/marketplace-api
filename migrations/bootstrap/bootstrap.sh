#!/bin/bash
set +e

cd "$(dirname "$0")"

[ ! -z $PGDATABASE ] || PGDATABASE=postgres
[ ! -z $PGUSER ] || PGUSER=postgres
[ ! -z $PGPASSWORD ] || PGPASSWORD=""
[ ! -z $PGHOST ] || PGHOST=localhost
[ ! -z $PGPORT ] || PGPORT=5432

alias psql="PGDATABASE=$PGDATABASE \
  PGUSER=$PGUSER \
  PGPASSWORD=$PGPASSWORD \
  PGHOST=$PGHOST \
  PGPORT=$PGPORT psql"

APP="apiko_courses"

psql -c "CREATE DATABASE $APP TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';"

psql --dbname "$APP" -f extensions.sql -At
