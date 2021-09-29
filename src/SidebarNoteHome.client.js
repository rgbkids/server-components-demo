// import {useTransition} from "react";
import {useRefresh} from "./Cache.client";
import {createFromReadableStream} from "react-server-dom-webpack";

import {useState, useRef, useEffect, useTransition} from 'react';

import {useLocation} from './LocationContext.client';
// import {useSignIn} from "./fire";

const host = location.host;
const protocol = location.protocol;

export default function SidebarNoteHome({note, isBookmark, bookmarkId, userId}) {
    console.log(`SidebarNoteHome client isBookmark=${isBookmark}, bookmarkId=${bookmarkId}, userId=${userId}`);

    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();
    const [, startNavigating] = useTransition();
    const refresh = useRefresh();

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
    async function handleDeleteBookmark(user_id, video_id, bookmarkId) {
        const payload = {};
        const requestedLocation = {
            selectedId: video_id,
            isEditing: "",
            searchText: "",
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
                    <iframe width="840"
                            height="472"
                            src={src}
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                    </iframe>
                    <button onClick={() => {
                        startTransition(() => {
                            handleDeleteBookmark(userId, videoId, bookmarkId);
                        });
                    }}>
                        -
                    </button>
                </>
                :
                <></>
            }
        </>
    );
}
