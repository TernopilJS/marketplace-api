--liquibase formatted sql

--changeset oleh:0001_is_alpha splitStatements:false
CREATE FUNCTION is_alpha(string TEXT)
	RETURNS BOOLEAN AS
$$
BEGIN
	RETURN string ~ '[[:alpha:]]';
END;
$$
	LANGUAGE plpgsql
	IMMUTABLE
	PARALLEL SAFE
	SECURITY INVOKER
	STRICT;

COMMENT ON FUNCTION is_alpha(string TEXT)
	IS 'ensures that given string contains only characters';
--rollback DROP FUNCTION is_alpha(string TEXT)
