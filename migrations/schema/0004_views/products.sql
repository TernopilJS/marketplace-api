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
