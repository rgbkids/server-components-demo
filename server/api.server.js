/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

// import fetch from 'node-fetch';
// import {db} from "../src/db.server";

const {fetch} = require('react-fetch');
// const {fetch} = require('node-fetch');
const cron = require('node-cron');


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

let PORT = 80;//process.env.PORT || 80;
const app = express();

app.use(compress());
app.use(express.json());

// http
app
    .listen(PORT, () => {
        console.log(`React Notes listening at ${PORT}...`);
    })
    .on('error', function (error) {
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

// https
let server = app;
let https = (process.env.PROTOCOL === "https:");
if (https) {
    PORT = 443;
    let https = require('https');
    let fs = require('fs');
    let options = {
        key: fs.readFileSync(__dirname + '/privkey.pem'), // TODO: ファイルをコミットしない
        cert: fs.readFileSync(__dirname + '/fullchain.pem'), // TODO: ファイルをコミットしない
    }
    server = https.createServer(options, app);
}
server
    .listen(PORT, () => {
        console.log(`React Notes listening at ${PORT}...`);
    })
    .on('error', function (error) {
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
    return async function (req, res, next) {
        try {
            return await fn(req, res);
        } catch (x) {
            console.log(x);
            next(x);
        }
    };
}

app.get(
    '/',
    handleErrors(async function (_req, res) {
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
        selectedId: location.selectedId,
        isEditing: location.isEditing,
        searchText: location.searchText,
        selectedTitle: location.selectedTitle,
        selectedBody: location.selectedBody,
        userId: location.userId,
        token: location.token,
    });
}

app.get('/react', function (req, res) {
    sendResponse(req, res, null);
});

const NOTES_PATH = path.resolve(__dirname, '../notes');

const auth = async (userId, token) => {
    // const users = await pool.query(
    //     `select *
    //      from users
    //      where user_id = $1
    //        and token = $2`,
    //     [
    //         "GjXKv5iQvDOdW7n2tlL6Q1Zp3fm2",
    //         "ACzBnChwuz-x1OV9fB3XFnOejkinGVghELQVFEFjmnKuSNn_IuTkeBB_bHNR3VDemJPHeiftGCN0lvuyi1H7yf-OH5VYPq1grp53QuGpg7Ggvjx6Ajdf2xq25hQzeeHlzkNKSHgqwlE_I5k-RGlF6ZwxJR4GPdobLEI6XrZkO2olynVCoc89GuTp3O2jkp4Ot5sld8N5tztWWKz5GEDY2SHlcYoptwzpCi6KqmSQ79Un7k69Hsu2khYnqwp9xxUhc188ngJKQnUHU9mY2XK_omlp9-G3uVConFR4jA5hRVf6mrU0wnpEKjcTC2MStZyQmBZLRmAnnqToJJwkiZIyER2-yzbHcdAdo16xir6NhL4-ip99hNNC0QmIpFh864O2rF0m9SVXhJY8WkTTf5N8bfDOMIW5_TxGNs8cBuUhOdCzU51d9ABDgsq1-AwwYVPgjSURbzjGADaiUu02P0yiinP64DBhR6oVtQ"
    //     ]
    //
    // ).rows;

    // const users = await pool.query(
    //     `select * from users`
    // ).rows;
    //
    // console.log(`------------ auth 1 ------------`);
    // console.log(users);
    // console.log(`------------ auth 2 ------------`);

    const {rows} = await pool.query(
        `select count(*) as result
         from users
         where user_id = $1
           and token = $2`,
        [
            userId, token
            // "GjXKv5iQvDOdW7n2tlL6Q1Zp3fm2",
            // "ACzBnChwuz-x1OV9fB3XFnOejkinGVghELQVFEFjmnKuSNn_IuTkeBB_bHNR3VDemJPHeiftGCN0lvuyi1H7yf-OH5VYPq1grp53QuGpg7Ggvjx6Ajdf2xq25hQzeeHlzkNKSHgqwlE_I5k-RGlF6ZwxJR4GPdobLEI6XrZkO2olynVCoc89GuTp3O2jkp4Ot5sld8N5tztWWKz5GEDY2SHlcYoptwzpCi6KqmSQ79Un7k69Hsu2khYnqwp9xxUhc188ngJKQnUHU9mY2XK_omlp9-G3uVConFR4jA5hRVf6mrU0wnpEKjcTC2MStZyQmBZLRmAnnqToJJwkiZIyER2-yzbHcdAdo16xir6NhL4-ip99hNNC0QmIpFh864O2rF0m9SVXhJY8WkTTf5N8bfDOMIW5_TxGNs8cBuUhOdCzU51d9ABDgsq1-AwwYVPgjSURbzjGADaiUu02P0yiinP64DBhR6oVtQ"
        ]
    );
    // console.log(`------------ auth 1 ------------ userId=${userId} token=${token}`);
    // console.log(rows);
    // console.log(rows[0].result);
    // console.log(`------------ auth 2 ------------`);

    return (rows[0].result == 1);
}

// TODO: userIdなのかuser_idなのか、渡す時に統一
app.post(
    '/bookmarks',
    handleErrors(async function (req, res) {
        // console.log(`------------ bookmarks 1 ------------ req.body.user_id=${req.body.user_id}, req.body.token=${req.body.token}`);

        // TODO: 認証
        if (await auth(req.body.user_id, req.body.token) === false) {
            sendResponse(req, res, null);
            // console.log(`------------ bookmarks 2 ------------`);

            return;
        }
        // {
        //     const {rows} = await pool.query('select * from users');
        //     // res.json(rows);
        //
        //     console.log(`------------ auth 1 ------------`);
        //     console.log(rows);
        //     console.log(`------------ auth 2 ------------`);
        // }

        // console.log(`------------ bookmarks 3 ------------`);


        const now = new Date();
        const result = await pool.query(
            'insert into bookmarks (user_id, video_id, created_at, updated_at) values ($1, $2, $3, $3) returning bookmark_id',
            [req.body.user_id, req.body.video_id, now]
        );

        const insertedId = result.rows[0].bookmark_id;
        // await writeFile(
        //     path.resolve(NOTES_PATH, `${insertedId}.md`),
        //     req.body.body,
        //     'utf8'
        // );
        // sendResponse(req, res, insertedId);
        sendResponse(req, res, null);
    })
);


app.post(
    '/users',
    handleErrors(async function (req, res) {
        const user_id = req.body.user_id;
        const token = req.body.token;

        // const updatedId = Number(req.params.id);
        const now = new Date();

        await pool.query(
            'update users set token = $2, memo = $1, updated_at = $3 where user_id = $1',
            [user_id, token, now]
        );

        const result = await pool.query(
            'insert into users (token, memo, created_at, updated_at, user_id) values ($2, $1, $3, $3, $4) returning user_id',
            [user_id, token, now, user_id]
        );

        const insertedId = result.rows[0].user_id;
        // await writeFile(
        //     path.resolve(NOTES_PATH, `${insertedId}.md`),
        //     req.body.body,
        //     'utf8'
        // );
        sendResponse(req, res, insertedId);
    })
);

app.put(
    '/users/:id',
    handleErrors(async function (req, res) {
        const user_id = req.body.user_id;
        const token = req.body.token;

        const now = new Date();
        const updatedId = Number(req.params.id);

        await pool.query(
            'insert into bookmarks (user_id, video_id, created_at, updated_at) values ($1, $2, $3, $3) returning bookmark_id',
            [user_id, token, now]
        );
        await pool.query(
            'update users set token = $2, memo = $1, updated_at = $3 where user_id = $4',
            [user_id, token, now, updatedId]
        );
        // await writeFile(
        //     path.resolve(NOTES_PATH, `${updatedId}.md`),
        //     req.body.body,
        //     'utf8'
        // );
        sendResponse(req, res, null);
    })
);

app.delete(
    '/users/:id',
    handleErrors(async function (req, res) {
        // TODO: 認証
        if (await auth(req.body.user_id, req.body.token) === false) {
            sendResponse(req, res, null);
            // console.log(`------------ bookmarks 2 ------------`);

            return;
        }

        await pool.query('delete from users where id = $1', [req.params.id]);
        // await unlink(path.resolve(NOTES_PATH, `${req.params.id}.md`));
        sendResponse(req, res, null);
    })
);

app.delete(
    '/bookmarks/:id',
    handleErrors(async function (req, res) {
        // TODO: 認証
        if (await auth(req.body.user_id, req.body.token) === false) {
            sendResponse(req, res, null);
            // console.log(`------------ bookmarks 2 ------------`);

            return;
        }

        // console.log(`/bookmarks/:id ${req.params.id}`);

        await pool.query('delete from bookmarks where bookmark_id = $1', [req.params.id]);
        // await unlink(path.resolve(NOTES_PATH, `${req.params.id}.md`));
        sendResponse(req, res, null);
    })
);

app.get(
    '/notes',
    handleErrors(async function (_req, res) {
        const {rows} = await pool.query('select * from notes order by id desc');
        res.json(rows);
    })
);

app.get(
    '/notes/:id',
    handleErrors(async function (req, res) {
        const {rows} = await pool.query('select * from notes where id = $1', [
            req.params.id,
        ]);
        res.json(rows[0]);
    })
);

app.get('/sleep/:ms', function (req, res) {
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

// app.get(
//     '/sync',
//     handleErrors(async function (req, res) {
//         let title = req.query.title;
//         let body = req.query.body;
//         let id = req.query.id;
//         let thumbnail = req.query.thumbnail;
//
//         console.log(`-------------------------------------------------- sync`);
//
//         const now = new Date();
//         const result = await pool.query(
//             'insert into notes (id, title, body, created_at, updated_at, thumbnail) values ($4, $1, $2, $3, $3, $5) returning id',
//             [title, body, now, id, thumbnail]
//         );
//         const returning_id = result.rows[0].id;
//
//         res.json({
//             result: "true",
//             id: `${returning_id}`,
//         });
//     })
// );

// TODO: 外部ファイル？
const getKey = () => {
    const keys = [
        // https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials?project=
        // https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=

        "AIzaSyAkhRemmID_N_CSd2zW9GqDrPJQssTOEiY",
        "AIzaSyAIRDMnwqNf6zTSVhR5wQul1XBnDyH-PqI",
        "AIzaSyCV2LPN6RFtGFfWLtrx8OiIkhj8qD7v9Zo",
        "AIzaSyCC-FYd9K-VhVZVzGOiJ_ltLPwck_1bkMc",
        "AIzaSyAtK1DbsKVmQPl8DDpyVe_7J_CLdEdEzps",
        "AIzaSyCPTFcXn0V-0fEefMIAGrwUBg2o0urdU3E",
    ];

    return keys[Math.floor(Math.random() * keys.length)];
}

app.get(
    '/cron',
    handleErrors(async function (req, res) {
        try {
            getYouTubeData();

            res.json({
                result: "true",
            });
        } catch (e) {
            console.log(e.message);

            res.json({
                result: "false",
                message: e.message,
            });
        }
    })
);

function getYouTubeData() {
    const search = process.env.SEARCH;
    const key = getKey();
    const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&eventType=live&&maxResults=100&order=date&q=${search}`;

    // console.log(`YouTube: ${endPointYouTube}`);

    const request = require('request');
    const options = {
        method: 'GET',
        json: true,
        url: `${endPointYouTube}`,
    }
    request(options, function (error, response, body) {
        // console.log(body);

        if (body.items) {
            const items = body.items;

            if (items && items.length > 0) {
                // console.log(items.map);

                if (items.map) {
                    // console.log(`------------- 1`);

                    items.map((item) => {
                        // console.log(`------------- 2`);
                        // console.log(item);

                        const videoId = item.id.videoId;
                        const title = item.snippet.title;
                        const channelId = item.snippet.channelId;
                        const description = item.snippet.description;
                        const thumbnail = item.snippet.thumbnails.default.url;

                        const titleEncode = encodeURI(title);
                        const descriptionEncode = encodeURI(description);

                        const endPoint = `/sync/?title=${titleEncode}&body=${descriptionEncode}&id=${videoId}&thumbnail=${thumbnail}`;

                        // console.log(`------------- endPoint=${endPoint}`);

                        const now = new Date();
                        const result = pool.query(
                            'insert into notes (id, title, body, created_at, updated_at, thumbnail) values ($4, $1, $2, $3, $3, $5) returning id',
                            [title, description, now, videoId, thumbnail]
                        );
                        // const returning_id = result.rows[0].id;

                        // console.log(result);
                        // fetch(result);
                    });

                    // console.log(`------------- 3`);

                }
            }
        }
    });
}

function clearYouTubeData() {
    pool.query(
        "DELETE FROM notes WHERE created_at < current_date + interval '-1 day'",
    );

    pool.query(
        "DELETE FROM bookmarks WHERE created_at < current_date + interval '-1 day'",
    );
}

cron.schedule('* * * * *', () => {
    try {
        getYouTubeData();

        clearYouTubeData();
    } catch (e) {
        console.log(e.message);
    }
});