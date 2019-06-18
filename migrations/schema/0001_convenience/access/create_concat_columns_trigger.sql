--liquibase formatted sql

--changeset oleh:0001_create_concat_columns_trigger splitStatements:false
CREATE OR REPLACE FUNCTION create_concat_columns_trigger(
	"schema" TEXT,
	tbl TEXT,
	"target" TEXT,
	VARIADIC "columns" TEXT[]
)
	RETURNS VOID AS
$$
DECLARE
	clmns 		TEXT := array_to_string("columns", ', ');
  tbl_path 	TEXT := "schema"||'.'||tbl;
BEGIN
	EXECUTE format('DROP TRIGGER IF EXISTS %s_concat ON %s;', tbl, tbl_path);
	EXECUTE format('CREATE TRIGGER %1$s_concat ' ||
					'BEFORE UPDATE OF %2$s OR INSERT ON %3$s ' ||
					'FOR EACH ROW ' ||
					'EXECUTE FUNCTION concat_columns(%4$s, %2$s);', tbl, clmns, tbl_path, "target");
END;
$$
	LANGUAGE plpgsql
	VOLATILE
	PARALLEL UNSAFE
	SECURITY DEFINER
	STRICT;

--rollback DROP FUNCTION IF EXISTS create_concat_columns_trigger("schema" TEXT, tbl TEXT, "target" TEXT, VARIADIC "columns" TEXT[]);
