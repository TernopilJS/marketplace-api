--liquibase formatted sql

--changeset oleh:0001_is_alphanum splitStatements:false
CREATE FUNCTION is_alphanum(string TEXT)
	RETURNS BOOLEAN AS
$$
BEGIN
	RETURN string ~ '[[:alnum:]]';
END;
$$
	LANGUAGE plpgsql
	IMMUTABLE
	PARALLEL SAFE
	SECURITY INVOKER
	STRICT;

COMMENT ON FUNCTION is_alphanum(string TEXT)
	IS 'ensures that given string is alphanumeric';
--rollback DROP FUNCTION is_alphanum(string TEXT)
