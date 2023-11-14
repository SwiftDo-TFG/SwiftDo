--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


--
-- Name: oauth_clients; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE oauth_clients (
    client_id serial PRIMARY KEY,
    client_secret text NOT NULL,
    redirect_uri text NOT NULL,
    grants text NOT NULL
);


--
-- Name: oauth_authcode; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE oauth_authcode (
    authorization_code text NOT NULL PRIMARY KEY,
    expires_at timestamp without time zone NOT NULL,
    redirect_uri text NOT NULL,
    client_id INTEGER REFERENCES "oauth_clients" (client_id) NOT NULL,
    user_id INTEGER REFERENCES "users" (user_id) NOT NULL 
);


--
-- Name: oauth_tokens; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE oauth_tokens (
    access_token text NOT NULL PRIMARY KEY,
    access_token_expires_at timestamp without time zone NOT NULL,
    refresh_token text NOT NULL,
    refresh_token_expires_at timestamp without time zone NOT NULL,
    client_id INTEGER REFERENCES "oauth_clients" (client_id) NOT NULL,
    user_id INTEGER REFERENCES "users" (user_id) NOT NULL 
);


INSERT INTO public.oauth_clients(client_id, client_secret, redirect_uri, grants)
VALUES(1234, '1234', 'http://localhost:3000/', 'authorization_code');


--
-- PostgreSQL database dump complete
--
