--liquibase formatted sql

--changeset oleh:0001_get_milliseconds splitStatements:false
CREATE FUNCTION get_milliseconds(date_value TIMESTAMPTZ)
	RETURNS BIGINT AS
$$
BEGIN
	RETURN EXTRACT(EPOCH FROM date_value) * 1000;
END;
$$
	LANGUAGE plpgsql
	IMMUTABLE
	PARALLEL SAFE
	SECURITY INVOKER
	STRICT;

COMMENT ON FUNCTION get_milliseconds(date_value TIMESTAMPTZ)
	IS 'returns the number of miliseconds since 1970-01-01';
--rollback DROP FUNCTION get_milliseconds(date_value TIMESTAMPTZ)
