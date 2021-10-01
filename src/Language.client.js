import Spinner from "./Spinner";
import {useEffect, useState, useTransition} from "react";
import {useLocation} from "./LocationContext.client";

export default function Language({searchText, selectedId, isEditing, selectedTitle, selectedBody, userId, token, lang}) {

    console.log(`Language`);

    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();


    async function handleSetLanguage(user_id, token) {
        const payload = {user_id, token};
        const endpoint = `${protocol}//${host}/users/`;
        const method = `POST`;
        const response = await fetch(
            // `${endpoint}?location=${encodeURIComponent(JSON.stringify(requestedLocation))}`,
            `${endpoint}`,
            {
                method,
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        // console.log(response);
    }

    return (
        <div className="language">
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        ...loc,
                        lang: "en",
                    }));
                });
            }}>
                🇺🇸
            </a>
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        ...loc,
                        lang: "ja",
                    }));
                });
            }}>
                🇯🇵
            </a>
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        ...loc,
                        lang: "zh_cmn_Hant",
                    }));
                });
            }}>
                🇹🇼
            </a>
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        ...loc,
                        lang: "ko",
                    }));
                });
            }}>
                🇰🇷
            </a>
        </div>
    );
}
