--liquibase formatted sql

--changeset oleh:0003_messages splitStatements:false
CREATE TABLE chat.messages
(
	id            INT               NOT NULL,
	chat_id       UUID              NOT NULL,
	owner_id      UUID              NOT NULL,

	text       		html_escaped_text NOT NULL,
	read          BOOLEAN           NOT NULL DEFAULT FALSE,

	created_at    actual_timestamp,
	updated_at    TIMESTAMPTZ,

	CONSTRAINT messages_pk PRIMARY KEY (id, chat_id),

	CONSTRAINT message_chat_fk FOREIGN KEY (chat_id) REFERENCES chat.chats (id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
		DEFERRABLE INITIALLY DEFERRED,

	CONSTRAINT message_owner_fk FOREIGN KEY (owner_id) REFERENCES users (id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
		DEFERRABLE INITIALLY DEFERRED
);

--rollback DROP TABLE chat.messages;
