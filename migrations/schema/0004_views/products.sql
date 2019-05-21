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
