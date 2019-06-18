--liquibase formatted sql

--changeset oleh:0004_views.active_products splitStatements:false

CREATE VIEW views.active_products AS
SELECT  p.id,
       	p.owner_id,
       	p.title,
       	p.location,
       	p.price,
				p.description,
				p.photos,
        p.created_at,
        p.updated_at
FROM products AS p
WHERE p.active = true;

--rollback DROP VIEW views.active_products;

--changeset oleh:0004_views.active_products_with_user splitStatements:false

CREATE VIEW views.active_products_with_user AS
SELECT  p.id,
       	p.title,
       	p.location,
       	p.price,
				p.description,
				p.photos,
        p.created_at,
        p.updated_at,
				json_build_object(
					'id', u.id,
					'email', u.email,
					'fullName', u.full_name,
					'avatar', u.avatar,
					'phone', u.phone,
					'createdAt', EXTRACT(EPOCH FROM u.created_at) * 1000, -- converts to string during json serialization, but we need a number
					'updatedAt', EXTRACT(EPOCH FROM u.updated_at) * 1000
				) AS owner
FROM products AS p
	LEFT JOIN users AS u ON (p.owner_id = u.id)
WHERE p.active = true;

--rollback DROP VIEW views.active_products_with_user;

--changeset oleh:0004_views.active_products_with_user_location splitStatements:false

CREATE OR REPLACE VIEW views.active_products_with_user AS
SELECT
	p.id,
	p.title,
	p.location,
	p.price,
	p.description,
	p.photos,
	p.created_at,
	p.updated_at,
	u.user AS owner
FROM views.active_products AS p
	LEFT JOIN views.users_json AS u ON (p.owner_id = (u.user->>'id')::UUID);

--rollback CREATE OR REPLACE VIEW views.active_products_with_user AS
--rollback SELECT
--rollback 	p.id,
--rollback 	p.title,
--rollback 	p.location,
--rollback 	p.price,
--rollback 	p.description,
--rollback 	p.photos,
--rollback 	p.created_at,
--rollback 	p.updated_at,
--rollback 	json_build_object(
--rollback 		'id', u.id,
--rollback 		'email', u.email,
--rollback 		'fullName', u.full_name,
--rollback 		'avatar', u.avatar,
--rollback 		'phone', u.phone,
--rollback 		'createdAt', get_milliseconds(u.created_at),
--rollback 		'updatedAt', get_milliseconds(u.updated_at)
--rollback 	) AS owner
--rollback FROM products AS p
--rollback 	LEFT JOIN users AS u ON (p.owner_id = u.id)
--rollback WHERE p.active = true;


--changeset oleh:0004_views.products_with_keywords splitStatements:false
CREATE VIEW views.products_with_keywords AS
SELECT
	p.id,
	p.owner_id,
	p.title,
	p.location,
	p.price,
	p.description,
	p.photos,
	p.created_at,
	p.updated_at,
	p.keywords
FROM products AS p
WHERE p.active = true;

--rollback DROP VIEW views.products_with_keywords;
