--liquibase formatted sql

--changeset oleh:0001_drop_concat_columns_trigger splitStatements:false
CREATE OR REPLACE FUNCTION drop_concat_columns_trigger(
	"schema" TEXT,
	tbl TEXT
)
	RETURNS VOID AS
$$
BEGIN
	EXECUTE format('DROP TRIGGER IF EXISTS %s_concat ON %2$s.%1$s;', tbl, "schema");

	RAISE INFO 'Dropped concat_columns trigger on %s', tbl;
END;
$$
	LANGUAGE plpgsql
	VOLATILE
	PARALLEL UNSAFE
	SECURITY DEFINER
	STRICT;

--rollback DROP FUNCTION IF EXISTS drop_concat_columns_trigger("schema" TEXT, tbl TEXT);
