--liquibase formatted sql

--changeset oleh:0005_data_chats_participants splitStatements:false

UPDATE chat.chats as c
	SET participants = array_append(c.participants, c.owner_id)
	WHERE NOT (c.participants @> ARRAY[c.owner_id]);

--rollback UPDATE chat.chats as c
--rollback SET participants = array_remove(c.participants, c.owner_id)
--rollback WHERE (c.participants @> ARRAY[c.owner_id]);
