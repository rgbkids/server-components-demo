/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {Pool} = require('pg');
const {readdir, unlink, writeFile} = require('fs/promises');
const startOfYear = require('date-fns/startOfYear');
const credentials = require('../credentials');

const VTEACHERS_PATH = './vteachers';
const pool = new Pool(credentials);

const now = new Date();
const startOfThisYear = startOfYear(now);
// Thanks, https://stackoverflow.com/a/9035732
function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const dropTableStatement = 'DROP TABLE IF EXISTS vteachers;';
const createTableStatement = `CREATE TABLE vteachers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);`;
const insertVTeacherStatement = `INSERT INTO vteachers(title, body, created_at, updated_at)
  VALUES ($1, $2, $3, $3)
  RETURNING *`;
const seedData = [
  [
    'Meeting VTeachers',
    'This is an example vteacher. It contains **Markdown**!',
    randomDateBetween(startOfThisYear, now),
  ],
  [
    'Make a thing',
    `It's very easy to make some words **bold** and other words *italic* with
Markdown. You can even [link to React's website!](https://www.reactjs.org).`,
    randomDateBetween(startOfThisYear, now),
  ],
  [
    'A vteacher with a very long title because sometimes you need more words',
    `You can write all kinds of [amazing](https://en.wikipedia.org/wiki/The_Amazing)
vteachers in this app! These vteacher live on the server in the \`vteachers\` folder.

![This app is powered by React](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/React_Native_Logo.png/800px-React_Native_Logo.png)`,
    randomDateBetween(startOfThisYear, now),
  ],
  ['I wrote this vteacher today', 'It was an excellent vteacher.', now],
];

async function seed() {
  await pool.query(dropTableStatement);
  await pool.query(createTableStatement);
  const res = await Promise.all(
    seedData.map((row) => pool.query(insertVTeacherStatement, row))
  );

  const oldVTeachers = await readdir(path.resolve(VTEACHERS_PATH));
  await Promise.all(
    oldVTeachers
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => unlink(path.resolve(VTEACHERS_PATH, filename)))
  );

  await Promise.all(
    res.map(({rows}) => {
      const id = rows[0].id;
      const content = rows[0].body;
      const data = new Uint8Array(Buffer.from(content));
      return writeFile(path.resolve(VTEACHERS_PATH, `${id}.md`), data, (err) => {
        if (err) {
          throw err;
        }
      });
    })
  );
}

seed();
