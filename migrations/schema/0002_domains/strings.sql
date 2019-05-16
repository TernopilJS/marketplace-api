--liquibase formatted sql

--changeset oleh:0002_alpha splitStatements:false

CREATE DOMAIN alpha AS VARCHAR(128)
	CONSTRAINT alpha_not_blank CHECK (not_blank(VALUE))
	CONSTRAINT alpha_too_long CHECK (length(VALUE) < 64)
	CONSTRAINT alpha_check CHECK (is_alpha(VALUE));

COMMENT ON DOMAIN alpha IS 'not blank VARCHAR(128) alpha string';

--rollback DROP DOMAIN alpha;

--changeset oleh:0002_alphanum splitStatements:false

CREATE DOMAIN alphanum AS VARCHAR(128)
	CONSTRAINT alphanum_not_blank CHECK (not_blank(VALUE))
	CONSTRAINT alphanum_too_long CHECK (length(VALUE) < 128)
	CONSTRAINT alphanum_check CHECK (is_alphanum(VALUE));

COMMENT ON DOMAIN alphanum IS 'not blank VARCHAR(128) alphanumeric string';

--rollback DROP DOMAIN alphanum;

--changeset oleh:0002_html_escaped_string splitStatements:false

CREATE DOMAIN html_escaped_string AS VARCHAR(128)
	CONSTRAINT html_escaped_string_not_blank CHECK (not_blank(VALUE))
	CONSTRAINT html_escaped_string_too_long CHECK (length(VALUE) < 128)
	CONSTRAINT html_escaped_string_check CHECK (is_html_escaped(VALUE));

COMMENT ON DOMAIN html_escaped_string IS 'not blank VARCHAR(64) html escaped string';

--rollback DROP DOMAIN html_escaped_string;

--changeset oleh:0002_html_escaped_text splitStatements:false

CREATE DOMAIN html_escaped_text AS TEXT
	CONSTRAINT html_escaped_text_not_blank CHECK (not_blank(VALUE))
	CONSTRAINT html_escaped_text_check CHECK (is_html_escaped(VALUE));

COMMENT ON DOMAIN html_escaped_string IS 'not blank html escaped TEXT';

--rollback DROP DOMAIN html_escaped_text;
