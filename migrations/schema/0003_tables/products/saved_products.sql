--liquibase formatted sql

--changeset oleh:0003_saved_products splitStatements:false
CREATE TABLE saved_products
(
	product_id 	UUID 	NOT NULL,
	owner_id 		UUID 	NOT NULL,

	created_at	actual_timestamp,

	CONSTRAINT saved_products_pkey PRIMARY KEY (product_id, owner_id),

	CONSTRAINT saved_products_product_fk FOREIGN KEY (product_id) REFERENCES products (id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
		DEFERRABLE INITIALLY DEFERRED,

	CONSTRAINT saved_products_owner_fk FOREIGN KEY (owner_id) REFERENCES users (id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
		DEFERRABLE INITIALLY DEFERRED
);

--rollback DROP TABLE saved_products;
