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

[ ! -z $APP_PWD ] || APP_PWD="$APP"

# NOTE: make sure scram-sha256 is being used for hashing instead of md5 in postgresql.conf
# password_encryption = scram-sha-256

psql -c "CREATE USER $APP WITH ENCRYPTED PASSWORD '$APP_PWD';"
psql -c "CREATE DATABASE $APP WITH OWNER = $APP TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';"

psql --dbname "$APP" -f extensions.sql -At
