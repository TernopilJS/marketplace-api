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

if [ "$NODE_ENV" = "production" ]; then
  psql -f extensions.sql -At
else
  APP="apiko_courses"
  psql --dbname "$APP" -f extensions.sql -At
fi
