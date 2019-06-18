--liquibase formatted sql

--changeset oleh:0001_concat_columns splitStatements:false
CREATE OR REPLACE FUNCTION concat_columns()
	RETURNS TRIGGER AS
$$
DECLARE
	"target" 	TEXT		:= TG_ARGV[0];
	"columns"	TEXT[]	:= TG_ARGV[1:];
	clmn 			TEXT;
	val 			TEXT;
	result 		TEXT := '';
BEGIN
	FOREACH clmn IN ARRAY "columns"
		LOOP
			EXECUTE format('SELECT $1.%s', clmn)
			USING NEW
			INTO val;

			result = result || COALESCE(val, '') || ' ';
		END LOOP;

	NEW := NEW #= hstore("target", result);

	RETURN NEW;
END;
$$
	LANGUAGE plpgsql
	VOLATILE
	PARALLEL SAFE
	SECURITY DEFINER
	STRICT;

--rollback DROP FUNCTION IF EXISTS concat_columns();
