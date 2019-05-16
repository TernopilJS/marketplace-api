--liquibase formatted sql

--changeset oleh:0003_users splitStatements:false
CREATE TABLE users
(
	id                 UUID               NOT NULL,

	email           	 email    					NOT NULL,
  password_hash      password_hash      NOT NULL,
	password_hash_type password_hash_func NOT NULL,

  full_name          alphanum           NOT NULL,
  avatar             VARCHAR,
  phone              phone,

	created_at         actual_timestamp,
	updated_at         TIMESTAMPTZ,

	CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE UNIQUE INDEX user_email_unique
	ON users(email);

--rollback DROP INDEX user_email_unique; DROP TABLE users;
