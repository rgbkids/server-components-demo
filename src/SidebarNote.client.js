import {useState, useRef, useEffect, useTransition} from 'react';

import {useLocation} from './LocationContext.client';
import {useSignIn} from "./fire";

import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

export default function SidebarNote({id, title, body, children, expandedChildren, bookmarkId, isBookmark, userId}) {
    console.log(`SidebarNote client bookmark=${isBookmark} bookmarkId=${bookmarkId}`);

    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();
    const [isExpanded, setIsExpanded] = useState(false);
    const isActive = id === location.selectedId;

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

    async function handleAddBookmark(user_id, video_id) {
        const payload = {user_id, video_id};
        const requestedLocation = {
            selectedId: id,
            isEditing: "",
            searchText: "",
            selectedTitle: "",
            selectedBody: "",
            userId: user_id,
        };
        const endpoint = `https://localhost/bookmarks/`;
        const method = `POST`;
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

    // Animate after title is edited.
    const itemRef = useRef(null);
    const prevTitleRef = useRef(title);
    useEffect(() => {
        if (title !== prevTitleRef.current) {
            prevTitleRef.current = title;
            itemRef.current.classList.add('flash');
        }
    }, [title]);

    const titleEncode = encodeURI(title);
    const bodyEncode = encodeURI(body);

    return (
        <>
            <div
                ref={itemRef}
                onAnimationEnd={() => {
                    itemRef.current.classList.remove('flash');
                }}
                className={[
                    'sidebar-note-list-item',
                    isExpanded ? 'note-expanded' : '',
                ].join(' ')}>

                {children}

                <button
                    className="sidebar-note-open"
                    style={{
                        backgroundColor: isPending
                            ? 'var(--gray-80)'
                            : isActive
                                ? 'var(--tertiary-blue)'
                                : '',
                        border: isActive
                            ? '1px solid var(--primary-border)'
                            : '1px solid transparent',
                    }}
                    onClick={() => {
                        startTransition(() => {
                            setLocation((loc) => ({
                                selectedId: id,
                                isEditing: false,
                                searchText: loc.searchText,
                                selectedTitle: titleEncode,
                                selectedBody: bodyEncode,
                                userId: loc.userId,
                            }));
                        });
                    }}>
                    Open note for preview
                </button>
                <button
                    className="sidebar-note-toggle-expand"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}>
                    {isExpanded ? (
                        <img
                            src="chevron-down.svg"
                            width="10px"
                            height="10px"
                            alt="Collapse"
                        />
                    ) : (
                        <img src="chevron-up.svg" width="10px" height="10px" alt="Expand"/>
                    )}
                </button>
                {isExpanded && expandedChildren}
            </div>
            {isBookmark
                ?
                <></>
                :
                <button onClick={() => {
                    startTransition(() => {
                        handleAddBookmark(userId, id)
                    });
                }}>
                    +
                </button>
            }
        </>
    );
}
