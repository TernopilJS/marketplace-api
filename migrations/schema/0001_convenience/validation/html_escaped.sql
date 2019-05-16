--liquibase formatted sql

--changeset oleh:0001_is_html_escaped splitStatements:false
CREATE FUNCTION is_html_escaped(string TEXT)
	RETURNS BOOLEAN AS
$$
DECLARE
BEGIN
	RETURN NOT string ~ '(<|>|''|"|&)+';
END;
$$
	LANGUAGE plpgsql
	IMMUTABLE
	PARALLEL SAFE
	SECURITY INVOKER
	STRICT;

COMMENT ON FUNCTION is_html_escaped(string TEXT)
	IS 'ensures that given string contains no HTML restricted characters';
--rollback DROP FUNCTION is_html_escaped(string TEXT);
