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

--changeset oleh:0004_views.users_location splitStatements:false

CREATE OR REPLACE VIEW views.users_location AS
SELECT
	u.id,
	u.email,
	u.full_name,
	u.avatar,
	u.phone,
	u.password_hash,
	u.password_hash_type,
	u.created_at,
	u.updated_at,
	u.location
FROM users AS u;

--rollback DROP VIEW views.users_location;

--changeset oleh:0004_views.users_json_location splitStatements:false

CREATE OR REPLACE VIEW views.users_json AS
SELECT
	json_build_object(
		'id', u.id,
		'email', u.email,
		'fullName', u.full_name,
		'avatar', u.avatar,
		'phone', u.phone,
		'location', u.location,
		'createdAt', get_milliseconds(u.created_at),
		'updatedAt', get_milliseconds(u.updated_at)
	) as user
FROM views.users_location AS u;

--rollback CREATE OR REPLACE VIEW views.users_json AS
--rollback SELECT
--rollback 	json_build_object(
--rollback 		'id', u.id,
--rollback 		'email', u.email,
--rollback 		'fullName', u.full_name,
--rollback 		'avatar', u.avatar,
--rollback 		'phone', u.phone,
--rollback 		'createdAt', get_milliseconds(u.created_at),
--rollback 		'updatedAt', get_milliseconds(u.updated_at)
--rollback 	) as user
--rollback FROM views.users AS u;
