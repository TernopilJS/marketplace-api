#!/bin/bash

./migrations/bootstrap/extensions.sh

cd migrations/schema
./liquibase.groovy update
