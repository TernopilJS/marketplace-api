--liquibase formatted sql

--changeset oleh:0004_views.messages splitStatements:false

CREATE VIEW views.messages AS
SELECT  m.id,
       	m.chat_id,
       	m.owner_id,
       	m.text,
       	m.read,
       	m.created_at,
				m.updated_at
FROM chat.messages as m;

--rollback DROP VIEW views.messages;

