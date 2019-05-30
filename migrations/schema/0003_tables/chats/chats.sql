--liquibase formatted sql

--changeset oleh:0003_chats splitStatements:false
CREATE TABLE chat.chats
(
	id         		UUID 		PRIMARY KEY,
	product_id		UUID		NOT NULL,
	owner_id   		UUID 		NOT NULL,
	participants	UUID []	NOT NULL,

	created_at 		actual_timestamp,
	updated_at 		TIMESTAMPTZ,

	CONSTRAINT chats_unique UNIQUE(product_id, owner_id)
		DEFERRABLE INITIALLY IMMEDIATE,

	CONSTRAINT chat_product_fk FOREIGN KEY (product_id) REFERENCES products (id)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
		DEFERRABLE INITIALLY DEFERRED,

	CONSTRAINT chat_user_fk FOREIGN KEY (owner_id) REFERENCES users (id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
		DEFERRABLE INITIALLY DEFERRED
);

--rollback DROP TABLE chat.chats;
