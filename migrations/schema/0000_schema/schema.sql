--liquibase formatted sql

--changeset oleh:0000_views
CREATE SCHEMA IF NOT EXISTS views;
--rollback DROP SCHEMA views;

--changeset oleh:0000_seq
CREATE SCHEMA IF NOT EXISTS seq;
--rollback DROP SCHEMA seq;

--changeset oleh:0000_chat
CREATE SCHEMA IF NOT EXISTS chat;
--rollback DROP SCHEMA chat;
