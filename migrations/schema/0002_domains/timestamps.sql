--liquibase formatted sql

--changeset oleh:0002_actual_timestamp splitStatements:false
CREATE DOMAIN actual_timestamp AS TIMESTAMPTZ
	NOT NULL
	DEFAULT current_timestamp;

COMMENT ON DOMAIN actual_timestamp IS 'timestamp with a timezone, default current_timestamp'
--rollback DROP DOMAIN actual_timestamp;
