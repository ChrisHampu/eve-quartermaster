create sequence login_id_seq increment by 1 minvalue 1 no maxvalue start with 1;

CREATE TABLE login
(
  character_id integer NOT NULL,
  character_name text NOT NULL,
  corp_id integer,
  id integer NOT NULL DEFAULT nextval('login_id_seq'::regclass),
  token_expire text NOT NULL,
  alliance_id integer NOT NULL DEFAULT 0,
  corp_name text NOT NULL,
  CONSTRAINT "primary" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);