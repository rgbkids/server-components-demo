import Spinner from "./Spinner";
import {useEffect, useState, useTransition} from "react";
import {useLocation} from "./LocationContext.client";

export default function Language({searchText, selectedId, isEditing, selectedTitle, selectedBody, userId, token, lang}) {

    console.log(`Language`);

    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();

    return (
        <div className="language">
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        selectedId: loc.selectedId,
                        isEditing: loc.isEditing,
                        searchText: loc.searchText,
                        selectedTitle: loc.selectedTitle,
                        selectedBody: loc.selectedBody,
                        userId: loc.userId,
                        token: loc.token,
                        lang: "en",
                    }));
                });
            }}>
                🇺🇸
            </a>
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        selectedId: loc.selectedId,
                        isEditing: loc.isEditing,
                        searchText: loc.searchText,
                        selectedTitle: loc.selectedTitle,
                        selectedBody: loc.selectedBody,
                        userId: loc.userId,
                        token: loc.token,
                        lang: "ja",
                    }));
                });
            }}>
                🇯🇵
            </a>
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        selectedId: loc.selectedId,
                        isEditing: loc.isEditing,
                        searchText: loc.searchText,
                        selectedTitle: loc.selectedTitle,
                        selectedBody: loc.selectedBody,
                        userId: loc.userId,
                        token: loc.token,
                        lang: "zh_cmn_Hant",
                    }));
                });
            }}>
                🇹🇼
            </a>
            <a onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        selectedId: loc.selectedId,
                        isEditing: loc.isEditing,
                        searchText: loc.searchText,
                        selectedTitle: loc.selectedTitle,
                        selectedBody: loc.selectedBody,
                        userId: loc.userId,
                        token: loc.token,
                        lang: "ko",
                    }));
                });
            }}>
                🇰🇷
            </a>
        </div>
    );
}
