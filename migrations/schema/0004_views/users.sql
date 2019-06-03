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

--changeset oleh:0004_views.users_json splitStatements:false

CREATE VIEW views.users_json AS
SELECT
	json_build_object(
		'id', u.id,
		'email', u.email,
		'fullName', u.full_name,
		'avatar', u.avatar,
		'phone', u.phone,
		'createdAt', get_milliseconds(u.created_at),
		'updatedAt', get_milliseconds(u.updated_at)
	) as user
FROM views.users AS u;

--rollback DROP VIEW views.users_json;
