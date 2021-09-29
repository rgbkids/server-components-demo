// import {useTransition} from "react";
import {useRefresh} from "./Cache.client";
import {createFromReadableStream} from "react-server-dom-webpack";

import {useState, useRef, useEffect, useTransition} from 'react';

import {useLocation} from './LocationContext.client';
// import {useSignIn} from "./fire";

const host = location.host;
const protocol = location.protocol;

export default function SidebarNoteHome({selectedId, searchText, note, isBookmark, bookmarkId, userId}) {
    console.log(`SidebarNoteHome client selectedId=${selectedId} isBookmark=${isBookmark}, bookmarkId=${bookmarkId}, userId=${userId}`);

    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();
    const [, startNavigating] = useTransition();
    const refresh = useRefresh();

    // let nextId = "";
    // if (notes) {
    //     if (notes.length == 1) {
    //         nextId = "";
    //     } else if (index == (notes.length - 1)) {
    //         note = notes[notes.length - 2];
    //         console.log(note);
    //         nextId = note.id;
    //     }
    // }
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ selectedId = ${selectedId}`);

    function navigate(response) {
        const cacheKey = response.headers.get('X-Location');
        const nextLocation = JSON.parse(cacheKey);
        const seededResponse = createFromReadableStream(response.body);
        startNavigating(() => {
            refresh(cacheKey, seededResponse);
            setLocation(nextLocation);
        });
    }

    // 更新処理
    async function handleDeleteBookmark(user_id, video_id, bookmarkId, selectedId) {
        const payload = {};
        const requestedLocation = {
            selectedId: selectedId,
            isEditing: "",
            searchText: searchText,
            selectedTitle: "",
            selectedBody: "",
            userId: user_id,
        };
        const endpoint = `${protocol}//${host}/bookmarks/${bookmarkId}`;
        const method = `DELETE`;
        const response = await fetch(
            `${endpoint}?location=${encodeURIComponent(JSON.stringify(requestedLocation))}`,
            {
                method,
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response);
        navigate(response);
    }

    const videoId = note.id;
    const src = `https://www.youtube.com/embed/${videoId}`;

    return (
        <>
            {isBookmark
                ?
                <>
                    <button className="bookmark" onClick={() => {
                        handleDeleteBookmark(userId, videoId, bookmarkId, selectedId);
                    }}>
                        ❌
                    </button>
                    <div className="youtube">
                        <iframe width="294"
                                height="165"
                                src={src}
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                        </iframe>
                    </div>
                </>
                :
                <></>
            }
        </>
    );
}
