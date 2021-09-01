/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const register = require('react-server-dom-webpack/node-register');
register();
const babelRegister = require('@babel/register');

babelRegister({
  ignore: [/[\\\/](build|server|node_modules)[\\\/]/],
  presets: [['react-app', {runtime: 'automatic'}]],
  plugins: ['@babel/transform-modules-commonjs'],
});

const express = require('express');
const compress = require('compression');
const {readFileSync} = require('fs');
const {unlink, writeFile} = require('fs').promises;
const {pipeToNodeWritable} = require('react-server-dom-webpack/writer');
const path = require('path');
const {Pool} = require('pg');
const React = require('react');
const ReactApp = require('../src/App.server').default;

// Don't keep credentials in the source tree in a real app!
const pool = new Pool(require('../credentials'));

const PORT = process.env.PORT || 80;
const app = express();

app.use(compress());
app.use(express.json());

app
  .listen(PORT, () => {
    console.log(`React VTeachers listening at ${PORT}...`);
  })
  .on('error', function(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const isPipe = (portOrPipe) => Number.isNaN(portOrPipe);
    const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

function handleErrors(fn) {
  return async function(req, res, next) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

app.get(
  '/',
  handleErrors(async function(_req, res) {
    await waitForWebpack();
    const html = readFileSync(
      path.resolve(__dirname, '../build/index.html'),
      'utf8'
    );
    // Note: this is sending an empty HTML shell, like a client-side-only app.
    // However, the intended solution (which isn't built out yet) is to read
    // from the Server endpoint and turn its response into an HTML stream.
    res.send(html);
  })
);

async function renderReactTree(res, props) {
  await waitForWebpack();
  const manifest = readFileSync(
    path.resolve(__dirname, '../build/react-client-manifest.json'),
    'utf8'
  );
  const moduleMap = JSON.parse(manifest);
  pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap);
}

function sendResponse(req, res, redirectToId) {
  const location = JSON.parse(req.query.location);
  if (redirectToId) {
    location.selectedId = redirectToId;
  }
  res.set('X-Location', JSON.stringify(location));
  renderReactTree(res, {
    selectedId: location.selectedId
  });
}

app.get('/react', function(req, res) {
  sendResponse(req, res, null);
});

const VTEACHERS_PATH = path.resolve(__dirname, '../vteachers');

app.post(
  '/vteachers',
  handleErrors(async function(req, res) {
    const now = new Date();
    const result = await pool.query(
      'insert into vteachers (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id',
      [req.body.title, req.body.body, now]
    );
    const insertedId = result.rows[0].id;
    await writeFile(
      path.resolve(VTEACHERS_PATH, `${insertedId}.md`),
      req.body.body,
      'utf8'
    );
    sendResponse(req, res, insertedId);
  })
);

app.put(
  '/vteachers/:id',
  handleErrors(async function(req, res) {
    const now = new Date();
    const updatedId = Number(req.params.id);
    await pool.query(
      'update vteachers set title = $1, body = $2, updated_at = $3 where id = $4',
      [req.body.title, req.body.body, now, updatedId]
    );
    await writeFile(
      path.resolve(VTEACHERS_PATH, `${updatedId}.md`),
      req.body.body,
      'utf8'
    );
    sendResponse(req, res, null);
  })
);

app.delete(
  '/vteachers/:id',
  handleErrors(async function(req, res) {
    await pool.query('delete from vteachers where id = $1', [req.params.id]);
    await unlink(path.resolve(VTEACHERS_PATH, `${req.params.id}.md`));
    sendResponse(req, res, null);
  })
);

app.get(
  '/vteachers',
  handleErrors(async function(_req, res) {
    const {rows} = await pool.query('select * from vteachers order by id desc');
    res.json(rows);
  })
);

app.get(
  '/vteachers/:id',
  handleErrors(async function(req, res) {
    const {rows} = await pool.query('select * from vteachers where id = $1', [
      req.params.id,
    ]);
    res.json(rows[0] || "null");
  })
);

app.get('/sleep/:ms', function(req, res) {
  setTimeout(() => {
    res.json({ok: true});
  }, req.params.ms);
});

app.use(express.static('build'));
app.use(express.static('public'));

async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, '../build/index.html'));
      return;
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

app.post(
    '/deploy',
    handleErrors(async function(req, res) {
        
        const title = req.body.title
        const body = req.body.body

        if (!title || !body) {
            sendResponse(req, res, 0);
            return;
        }

        let userPort = body;
        let repositoryUrl = title;

        let execSync = require('child_process').execSync;
        const fs = require('fs');

        let path = require('path');
        let workPath = path.resolve(`../${userPort}`);

        let result = "";
        let cmd = "";

        if (fs.existsSync(workPath)) {
            cmd = `echo "cd ${workPath}/server-components-demo && git pull > /dev/null 2>&1 && npm i && docker-compose build && docker-compose up -d && docker-compose exec -T vteachers-app-${userPort} npm run seed" > ${workPath}/deploy.sh`;
            result = execSync(cmd);
            console.log(result.toString());
        } else {
            cmd = `mkdir ${workPath} && echo "cd ${workPath} && git clone ${repositoryUrl} && cd server-components-demo && npm i && docker-compose build && docker-compose up -d && docker-compose exec -T vteachers-app-${userPort} npm run seed" > ${workPath}/deploy.sh`;
            result = execSync(cmd);
            console.log(result.toString());
        }

        cmd = `sh ${workPath}/deploy.sh`;
        result = execSync(cmd);
        console.log(result.toString());

        sendResponse(req, res, 0);
    })
);

app.get(
    '/register',
    handleErrors(async function(req, res) {
        let title = req.query.title;
        let body  = req.query.body;

        if (!title) {
            res.json("null");
            return;
        }

        let id = -1;
        {
            {
                const {rows} = await pool.query('select * from vteachers where title = $1', [
                    title,
                ]);
                if (rows && rows.length > 0) {
                    id = rows[0].id;
                }
            }

            if (id < 0) {
                const now = new Date();
                const result = await pool.query(
                    'insert into vteachers (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id',
                    [title, body, now]
                );
                id = result.rows[0].id;
            }
        }

        if (id < 0) {
            res.json({
                result: "false",
                web_port: `-1`,
                db_port: `-1`
            });
            return;
        }

        const portDynamicMin = 49152;
        const portDynamicMax = 65535;
        const portNum = Math.trunc((portDynamicMax - portDynamicMin) / 2)
        let portWeb = portDynamicMin + id;
        let portDB  = portDynamicMin + portNum + id;

        res.json({
            result: "true",
            web_port: `${portWeb}`,
            db_port: `${portDB}`
        });
    })
);