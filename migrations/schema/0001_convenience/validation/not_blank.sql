--liquibase formatted sql

--changeset oleh:0001_not_blank splitStatements:false
CREATE FUNCTION not_blank(string TEXT)
	RETURNS BOOLEAN AS
$$
BEGIN
	RETURN length(trim_whitespace(string)) > 0;
END;
$$
	LANGUAGE plpgsql
	IMMUTABLE
	PARALLEL SAFE
	SECURITY INVOKER
	STRICT;

COMMENT ON FUNCTION not_blank(string TEXT)
	IS 'ensures that given string is not blank';
--rollback DROP FUNCTION not_blank(string TEXT);
