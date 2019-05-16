--liquibase formatted sql

--changeset oleh:0001_trim_whitespace splitStatements:false
CREATE FUNCTION trim_whitespace(string TEXT)
	RETURNS TEXT AS
$$
BEGIN
	RETURN trim(both ' \n\r\t' FROM string);
END;
$$
	LANGUAGE plpgsql
	IMMUTABLE
	PARALLEL SAFE
	SECURITY INVOKER
	STRICT;

COMMENT ON FUNCTION trim_whitespace(string TEXT)
	IS 'trim whitespaces from a given string';
--rollback DROP FUNCTION trim_whitespace(string TEXT);
