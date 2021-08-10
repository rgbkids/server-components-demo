# React Server Components Templates

## Setup

You will need to have nodejs >=14.9.0 in order to run this demo. [Node 14 LTS](https://nodejs.org/en/about/releases/) is a good choice!

  ```
  npm install
  npm start
  ```

(Or `npm run start:prod` for a production build.)

Then open http://localhost:4000.

The app won't work until you set up the database, as described below.

<details>
  <summary>Setup with Docker (optional)</summary>
  <p>You can also start dev build of the app by using docker-compose.</p>
  <p>⚠️ This is <b>completely optional,</b> and is only for people who <i>prefer</i> Docker to global installs!</p>
  <p>If you prefer Docker, make sure you have docker and docker-compose installed then run:</p>
  <pre><code>docker-compose up</code></pre>
  <h4>Running seed script</h4>
  <p>1. Run containers in the detached mode</p>
  <pre><code>docker-compose up -d</code></pre>
  <p>2. Run seed script</p>
  <pre><code>docker-compose exec vteachers-app npm run seed</code></pre>
  <p>If you'd rather not use Docker, skip this section and continue below.</p>
</details>

## DB Setup

This demo uses Postgres. First, follow its [installation link](https://wiki.postgresql.org/wiki/Detailed_installation_guides) for your platform.

Alternatively, you can check out this [fork](https://github.com/pomber/server-components-demo/) which will let you run the demo app without needing a database. However, you won't be able to execute SQL queries (but fetch should still work). There is also [another fork](https://github.com/prisma/server-components-demo) that uses Prisma with SQLite, so it doesn't require additional setup.

The below example will set up the database for this app, assuming that you have a UNIX-like platform:

### Step 1. Create the Database

```
psql postgres

CREATE DATABASE vteachersapi;
CREATE ROLE vteachersadmin WITH LOGIN PASSWORD 'password';
ALTER ROLE vteachersadmin WITH SUPERUSER;
ALTER DATABASE vteachersapi OWNER TO vteachersadmin;
\q
```

### Step 2. Connect to the Database

```
psql -d postgres -U vteachersadmin;

\c vteachersapi

DROP TABLE IF EXISTS vteachers;
CREATE TABLE vteachers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);

\q
```

### Step 3. Run the seed script

Finally, run `npm run seed` to populate some data.

And you're done!

## License
This demo is MIT licensed.
