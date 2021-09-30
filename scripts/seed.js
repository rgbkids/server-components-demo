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

const NOTES_PATH = './notes';
const pool = new Pool(credentials);

const now = new Date();
const startOfThisYear = startOfYear(now);
// Thanks, https://stackoverflow.com/a/9035732
function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const dropTableStatement = 'DROP TABLE IF EXISTS notes;';
const createTableStatement = `CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT,
  thumbnail TEXT
);`;
const insertNoteStatement = `INSERT INTO notes(title, body, created_at, updated_at, id, thumbnail)
  VALUES ($1, $2, $3, $3, $4, $5)
  RETURNING *`;
const seedData = [
    // ["title1", "body1", now, "videoId1", "logo.png"],
    // ["title2", "body2", now, "videoId2", "logo.png"],
    // ["title3", "body3", now, "videoId3", "logo.png"],
    // ["title4", "body4", now, "videoId4", "logo.png"],
];

const dropTableStatementUser = 'DROP TABLE IF EXISTS users;';
const createTableStatementUser = `CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  token TEXT,
  memo TEXT
);`;

const dropTableStatementBookmark = 'DROP TABLE IF EXISTS bookmarks;';
const createTableStatementBookmark = `CREATE TABLE bookmarks (
  bookmark_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  user_id TEXT,
  video_id TEXT
);`;

async function seed() {
  await pool.query(dropTableStatement);
  await pool.query(createTableStatement);
  await pool.query(dropTableStatementUser);
  await pool.query(createTableStatementUser);
  await pool.query(dropTableStatementBookmark);
  await pool.query(createTableStatementBookmark);
  const res = await Promise.all(
    seedData.map((row) => pool.query(insertNoteStatement, row))
  );

  const oldNotes = await readdir(path.resolve(NOTES_PATH));
  await Promise.all(
    oldNotes
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => unlink(path.resolve(NOTES_PATH, filename)))
  );

  await Promise.all(
    res.map(({rows}) => {
      const id = rows[0].id;
      const content = rows[0].body;
      const data = new Uint8Array(Buffer.from(content));
      return writeFile(path.resolve(NOTES_PATH, `${id}.md`), data, (err) => {
        if (err) {
          throw err;
        }
      });
    })
  );
}

seed();
