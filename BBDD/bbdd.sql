CREATE TABLE "users" (
    user_id serial PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR
);

CREATE TABLE projects (
    project_id serial PRIMARY KEY,
    name VARCHAR,
    description VARCHAR
);

CREATE TABLE tags (
    name VARCHAR PRIMARY KEY,
    colour VARCHAR
);

CREATE TABLE areas_contexts (
    context_id serial PRIMARY KEY,
    name VARCHAR
);

CREATE TABLE tasks (
    task_id serial PRIMARY KEY,
    user_id INTEGER REFERENCES "users" (user_id) NOT NULL,
    context_id INTEGER REFERENCES "areas_contexts" (context_id),
    project_id INTEGER REFERENCES "projects" (project_id),
    title VARCHAR NOT NULL,
    description VARCHAR,
    state VARCHAR,
    verification_list VARCHAR,
    important_fixed BOOLEAN,
    date_added DATE,
    date_completed DATE,
    date_limit DATE,
    date_changed TIME,
    num_version NUMERIC
);