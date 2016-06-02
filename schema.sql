CREATE TYPE fulfilled AS ENUM ('none', 'partial', 'full');

CREATE TABLE IF NOT EXISTS login
(
  character_id integer NOT NULL,
  character_name text NOT NULL,
  corp_id integer NOT NULL DEFAULT 0,
  id serial NOT NULL,
  token_expire text NOT NULL,
  alliance_id integer NOT NULL DEFAULT 0,
  corp_name text NOT NULL,
  CONSTRAINT "primary" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS session
(
  sid character varying NOT NULL,
  expires date,
  data text,
  createdAt date,
  updatedAt date,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS requests
(
  id serial NOT NULL,
  title text NOT NULL,
  status fulfilled NOT NULL DEFAULT 'none'::fulfilled,
  corp_only boolean NOT NULL DEFAULT false,
  character_id integer NOT NULL,
  contract_count integer NOT NULL DEFAULT 1,
  location integer,
  expires timestamp with time zone,
  CONSTRAINT requests_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS request_items
(
  id serial NOT NULL,
  request_id integer NOT NULL,
  item_name text NOT NULL,
  item_count integer NOT NULL DEFAULT 1,
  CONSTRAINT request_item_pkey PRIMARY KEY (id),
  CONSTRAINT request_fkey FOREIGN KEY (request_id)
      REFERENCES requests (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS notifications
(
  id serial, 
  character_id integer NOT NULL, 
  viewed boolean NOT NULL DEFAULT false,
  message text NOT NULL,
  time timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
) 
WITH (
  OIDS = FALSE
);
