CREATE TABLE "users" (
    user_id serial PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR
);

CREATE TABLE projects (
    project_id serial PRIMARY KEY,
    title VARCHAR,
    description VARCHAR, 
    user_id INTEGER references "users" (user_id),
    completed BOOLEAN,
    date_added DATE, 
    date_changed DATE, 
    date_completed DATE, 
    num_version NUMERIC,
    color varchar NOT NULL
);

CREATE TABLE tags (
    name VARCHAR PRIMARY KEY,
    colour VARCHAR
);

CREATE TABLE areas_contexts (
    context_id serial PRIMARY KEY,
    name VARCHAR,
    user_id INTEGER references "users" (user_id)
);

CREATE TABLE tasks (
    task_id serial PRIMARY KEY,
    user_id INTEGER REFERENCES "users" (user_id) NOT NULL,
    context_id INTEGER REFERENCES "areas_contexts" (context_id),
    project_id INTEGER REFERENCES "projects" (project_id),
    title VARCHAR NOT NULL,
    description VARCHAR,
    state NUMERIC (1,0),
    completed BOOLEAN,
    verification_list VARCHAR,
    important_fixed BOOLEAN,
    date_added DATE,
    date_completed DATE,
    date_limit TIMESTAMP,
    date_changed TIMESTAMP,
    num_version NUMERIC
);

CREATE TABLE tagstotask (
	task_id int4 NOT NULL,
	nametag varchar NOT NULL,
	CONSTRAINT tagstotask_pkey PRIMARY KEY (task_id, nametag),
	CONSTRAINT tagstotask_nametag_fkey FOREIGN KEY (nametag) REFERENCES public.tags("name"),
	CONSTRAINT tagstotask_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(task_id)
);