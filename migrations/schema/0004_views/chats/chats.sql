--liquibase formatted sql

--changeset oleh:0004_views.chats splitStatements:false

CREATE VIEW views.chats AS
SELECT  c.id,
       	c.product_id,
       	c.owner_id,
       	c.participants,
        c.created_at,
        c.updated_at
FROM chat.chats AS c;

--rollback DROP VIEW views.chats;

--changeset oleh:0004_views.chats_with_product_and_message splitStatements:false

CREATE VIEW views.chats_with_product_and_message AS
SELECT  c.id,
       	c.product_id,
       	c.owner_id,
       	c.participants,
        c.created_at,
        c.updated_at,
				json_build_object(
					'id', p.id,
					'title', p.title,
					'location', p.location,
					'price', p.price,
					'description', p.description,
					'photos', p.photos,
					'createdAt', get_milliseconds(p.created_at),
					'updatedAt', get_milliseconds(p.updated_at)
				) AS product,
				CASE WHEN message.id IS NOT NULL
          THEN json_build_object(
            'id', message.id,
            'chatId', message.chat_id,
            'ownerId', message.owner_id,
            'text', message.text,
            'read', message.read,
            'createdAt', get_milliseconds(message.created_at),
            'updatedAt', get_milliseconds(message.updated_at)
          )
				END as last_message
FROM chat.chats AS c
	LEFT JOIN products AS p ON (c.product_id = p.id)
	LEFT JOIN lateral
	(
		SELECT *
			FROM chat.messages AS m
			WHERE m.chat_id = c.id
			ORDER BY m.id DESC
			FETCH FIRST ROW ONLY
	) AS message ON true
ORDER BY GREATEST(c.created_at, message.created_at) DESC;

--rollback DROP VIEW views.chats_with_product_and_message;
