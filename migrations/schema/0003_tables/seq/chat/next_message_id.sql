--liquibase formatted sql

--changeset oleh:0003_next_message_id splitStatements:false
CREATE OR REPLACE FUNCTION seq.next_message_id(p_chat_id UUID)
	RETURNS INT AS
$$
DECLARE
	last_message_id INT;
BEGIN
	SELECT m.id
	FROM chat.messages AS m
	WHERE m.chat_id = p_chat_id
	ORDER BY m.id DESC
	FETCH FIRST ROW ONLY INTO last_message_id;

	IF last_message_id IS NULL
	THEN
		RETURN 0;
	ELSE
		RETURN last_message_id + 1;
	END IF;
END;
$$
	LANGUAGE plpgsql
	VOLATILE
	PARALLEL UNSAFE
	SECURITY DEFINER
	STRICT;

COMMENT ON FUNCTION seq.next_message_id(p_chat_id UUID)
	IS 'next message id composite key value, works as a sequence for the chat.messages composite pkey';

--rollback DROP FUNCTION seq.next_message_id(p_chat_id UUID)
