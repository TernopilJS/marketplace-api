--liquibase formatted sql

--changeset oleh:0003_products splitStatements:false
CREATE TABLE products
(
	id                UUID               	NOT NULL,
	owner_id     			UUID               	NOT NULL,

	title           	alphanum    				NOT NULL,
  location          html_escaped_text		NOT NULL,
  price             FLOAT 							NOT NULL,
  description      	html_escaped_text,
	photos 						TEXT[6],

	active						BOOLEAN							NOT NULL DEFAULT TRUE,

	created_at        actual_timestamp,
	updated_at        TIMESTAMPTZ,

	CONSTRAINT products_pk PRIMARY KEY (id),

	CONSTRAINT products_owner_fk FOREIGN KEY (owner_id) REFERENCES users (id)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
		DEFERRABLE INITIALLY DEFERRED
);

--rollback DROP TABLE products;
