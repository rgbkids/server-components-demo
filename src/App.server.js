/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {Suspense} from 'react';

import Note from './Note.server';
import NoteList from './NoteList.server';
import EditButton from './EditButton.client';
import SearchField from './SearchField.client';
import NoteSkeleton from './NoteSkeleton';
import NoteListSkeleton from './NoteListSkeleton';
import {fetch} from "react-fetch";
import {db} from "./db.server";

export default function App({selectedId, isEditing, searchText, selectedTitle, selectedBody}) {

    const now = new Date();
    const notes = db.query(
        `select updated_at from notes where updated_at + interval '00:01' > $1`,
        [now]
    ).rows;

    console.log(`---- notes ----`);
    console.log(notes);

    if (notes && notes.length == 0) {
        console.log(`---- get ----`);

        const keys = [
            "AIzaSyCC-FYd9K-VhVZVzGOiJ_ltLPwck_1bkMc",
            "AIzaSyDynnfe5PbvejqTdMZgvpKQv2iv0sc_DvU",
            "AIzaSyA05_WDaaFa615Nequ8IA3fcXPPb7L_TH8",
            "AIzaSyAohHwpRfDK-CuqjZIWZot4av7is0vMT14",
            "AIzaSyCcrPUTAuzkKnK3w_Vr5AIOeOHKGhqf8aU",
            "AIzaSyBAHQhkFqTTqWrEw23890VCOGEjQAD7bpc",
        ];

        const key = Math.floor(Math.random() * keys.length);

        const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=studywithme,study-with-me,study%20with%20me`;
        // const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=vtuber`;

        const videos = fetch(endPointYouTube).json();
        const items = videos.items;

        if (items && items.length > 0) {
            items.map((item) => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const channelId = item.snippet.channelId;
                const description = item.snippet.description;
                const thumbnail = item.snippet.thumbnails.default.url;

                const titleEncode = encodeURI(title);
                const descriptionEncode = encodeURI(description);

                // TODO: GETからPOSTにする
                const endPointPost = `http://localhost:4000/youtube/?title=${titleEncode}&body=${descriptionEncode}&id=${videoId}&thumbnail=${thumbnail}`;

                console.log(`endPointPost=${endPointPost}`);

                const _ = fetch(endPointPost);
            });
        }
    }

    return (
        <div className="main">
            <section className="col sidebar">
                <section className="sidebar-header">
                    <img
                        className="logo"
                        src="logo.png"
                        width="28px"
                        height="28px"
                        alt=""
                        role="presentation"
                    />
                    <a href={`http://localhost:4000/`}><strong>Study with me</strong></a>
                </section>
                <section className="sidebar-promotion">
                    <a href="https://apps.apple.com/app/vteacher/id1435002381" target="_blank"><p>&#9758;Start study with me!</p></a>
                </section>
                <section className="sidebar-menu" role="menubar">
                    <SearchField/>
                </section>
                <nav>
                    <Suspense fallback={<NoteListSkeleton/>}>
                        <NoteList searchText={searchText}/>
                    </Suspense>
                </nav>
            </section>
            <section key={selectedId} className="col note-viewer">
                <Suspense fallback={<NoteSkeleton isEditing={isEditing}/>}>
                    <Note selectedId={selectedId} isEditing={isEditing} selectedTitle={selectedTitle}
                          selectedBody={selectedBody}/>
                </Suspense>
            </section>
        </div>
    );
}
