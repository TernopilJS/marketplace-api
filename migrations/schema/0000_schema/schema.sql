--liquibase formatted sql

--changeset oleh:0000_views
CREATE SCHEMA IF NOT EXISTS views;
--rollback DROP SCHEMA views;
