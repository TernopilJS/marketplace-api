--liquibase formatted sql

--changeset oleh:0004_views.users splitStatements:false

CREATE VIEW views.users AS
SELECT  u.id,
       	u.email,
       	u.full_name,
       	u.avatar,
       	u.phone,
				u.password_hash,
				u.password_hash_type,
        u.created_at,
        u.updated_at
FROM users AS u;

--rollback DROP VIEW views.users;
