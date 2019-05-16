--liquibase formatted sql

--changeset oleh:0002_password_hash splitStatements:false
CREATE DOMAIN password_hash AS BYTEA
	CONSTRAINT password_too_long CHECK (length(VALUE) < 512);

COMMENT ON DOMAIN password_hash IS 'password hash byte array 512 bytes max';
--rollback DROP DOMAIN password_hash;

--changeset oleh:0002_password_hash_func_enum splitStatements:false
CREATE TYPE password_hash_func_enum AS ENUM ('argon2', 'scrypt', 'bcrypt');

CREATE DOMAIN password_hash_func AS password_hash_func_enum NOT NULL;

COMMENT ON DOMAIN password_hash_func IS 'password hash func, either argon2, scrypt, bcrypt';
--rollback DROP DOMAIN password_hash_func; DROP TYPE password_hash_func_enum;
