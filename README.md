# React Server Components Demo

* [What is this?](#what-is-this)
* [When will I be able to use this?](#when-will-i-be-able-to-use-this)
* [Setup](#setup)
* [DB Setup](#db-setup)
  + [Step 1. Create the Database](#step-1-create-the-database)
  + [Step 2. Connect to the Database](#step-2-connect-to-the-database)
  + [Step 3. Run the seed script](#step-3-run-the-seed-script)
* [Notes about this app](#notes-about-this-app)
  + [Interesting things to try](#interesting-things-to-try)
* [Built by (A-Z)](#built-by-a-z)
* [Code of Conduct](#code-of-conduct)
* [License](#license)

## What is this?

This is a demo app built with Server Components, an experimental React feature. **We strongly recommend [watching our talk introducing Server Components](https://reactjs.org/server-components) before exploring this demo.** The talk includes a walkthrough of the demo code and highlights key points of how Server Components work and what features they provide.

## When will I be able to use this?

Server Components are an experimental feature and **are not ready for adoption**. For now, we recommend experimenting with Server Components via this demo app. **Use this in your projects at your own risk.**

## Preferences

  ```
  sh preferences.sh
  ```

Required:

- credentials.js
- settings.js

  ```
  cp credentials.js.default ../credentials.js
  vi ../credentials.js
  
  cp settings.js.default ../settings.js
  vi ../settings.js
  ```

Option:

- fullchain.pem
- privkey.pem

  ```
  cp fullchain.pem.default ../fullchain.pem
  vi ../fullchain.pem
  
  cp privkey.pem.default ../privkey.pem
  vi ../privkey.pem
  ```

## Setup

You will need to have nodejs >=14.9.0 in order to run this demo. [Node 14 LTS](https://nodejs.org/en/about/releases/) is a good choice!

  ```
  npm install
  npm start
  ```

(Or `npm run start:prod` for a production build.)

Then open https://localhost .

The app won't work until you set up the database, as described below.

<details>
  <summary>Setup with Docker (optional)</summary>
  <p>You can also start dev build of the app by using docker-compose.</p>
  <p>⚠️ This is <b>completely optional,</b> and is only for people who <i>prefer</i> Docker to global installs!</p>
  <p>If you prefer Docker, make sure you have docker and docker-compose installed then run:</p>
  <pre><code>docker-compose up</code></pre>
  <p>(Clean: <code>docker system prune --volumes</code>)</p>
  <p>(Build: <code>docker-compose up --build</code>)</p>
  <h4>Running seed script</h4>
  <p>1. Run containers in the detached mode</p>
  <pre><code>docker-compose up -d</code></pre>
  <p>2. Run seed script</p>
  <pre><code>docker-compose exec notes-app npm run seed</code></pre>
  <p>If you'd rather not use Docker, skip this section and continue below.</p>
</details>

## DB Setup

This demo uses Postgres. First, follow its [installation link](https://wiki.postgresql.org/wiki/Detailed_installation_guides) for your platform.

Alternatively, you can check out this [fork](https://github.com/pomber/server-components-demo/) which will let you run the demo app without needing a database. However, you won't be able to execute SQL queries (but fetch should still work). There is also [another fork](https://github.com/prisma/server-components-demo) that uses Prisma with SQLite, so it doesn't require additional setup.

The below example will set up the database for this app, assuming that you have a UNIX-like platform:

### Step 1. Create the Database

```
psql postgres

CREATE DATABASE notesapi;
CREATE ROLE notesadmin WITH LOGIN PASSWORD 'password';
ALTER ROLE notesadmin WITH SUPERUSER;
ALTER DATABASE notesapi OWNER TO notesadmin;
\q
```

### Step 2. Connect to the Database

```
psql -d postgres -U notesadmin;

\c notesapi
```

(Read: `scripts/seed.js` .)

### Step 3. Run the seed script

Finally, run `npm run seed` to populate some data.

And you're done!

## Notes about this app

The demo is a note-taking app called **React Notes**. It consists of a few major parts:

- It uses a Webpack plugin (not defined in this repo) that allows us to only include client components in build artifacts
- An Express server that:
  - Serves API endpoints used in the app
  - Renders Server Components into a special format that we can read on the client
- A React app containing Server and Client components used to build React Notes

This demo is built on top of our Webpack plugin, but this is not how we envision using Server Components when they are stable. They are intended to be used in a framework that supports server rendering — for example, in Next.js. This is an early demo -- the real integration will be developed in the coming months. Learn more in the [announcement post](https://reactjs.org/server-components).

## Built by (A-Z)

- [Andrew Clark](https://twitter.com/acdlite)
- [Dan Abramov](https://twitter.com/dan_abramov)
- [Joe Savona](https://twitter.com/en_JS)
- [Lauren Tan](https://twitter.com/sugarpirate_)
- [Sebastian Markbåge](https://twitter.com/sebmarkbage)
- [Tate Strickland](http://www.tatestrickland.com/) (Design)

## [Code of Conduct](https://engineering.fb.com/codeofconduct/)
Facebook has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](https://engineering.fb.com/codeofconduct/) so that you can understand what actions will and will not be tolerated.

## License
This demo is MIT licensed.
