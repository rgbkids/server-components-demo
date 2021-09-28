import {useFirebase, useSignIn} from './fire';
import {useEffect, useState} from "react";

export default function Auth() {
    const [authSetting, setAuthSetting] = useState(false);
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState(null);

    async function handleCreate(title, body) {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: "",
            isEditing: false,
            searchText: "",
            selectedTitle: "",
            selectedBody: "",
        };
        const endpoint = `https://localhost/users/`;
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
    }

    // 更新処理
    async function handleUpdate(title, body, id) {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: "",
            isEditing: false,
            searchText: "",
            selectedTitle: "",
            selectedBody: "",
        };
        const endpoint = `https://localhost/users/${id}`;
        const method = `PUT`;
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
    }

    async function handleAddBookmark(user_id, video_id) {
        const payload = {user_id, video_id};
        const requestedLocation = {
            selectedId: "",
            isEditing: false,
            searchText: "",
            selectedTitle: "",
            selectedBody: "",
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
    }

    // 更新処理
    async function handleDeleteBookmark(id) {
        const payload = {};
        const requestedLocation = {
            selectedId: "",
            isEditing: false,
            searchText: "",
            selectedTitle: "",
            selectedBody: "",
        };
        const endpoint = `https://localhost/bookmarks/${id}`;
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
    }

    useEffect(() => {
        if (!authSetting) {
            setAuthSetting(true);

            useFirebase().auth().onAuthStateChanged(_user => {
                if (_user) {
                    console.log(_user);

                    setUser(_user);
                    setSigned(true);

                    handleCreate(_user.uid, _user.refreshToken);
                    handleUpdate(_user.uid, _user.refreshToken, _user.uid);

                    // handleAddBookmark(_user.uid, `video_id`);
                    handleDeleteBookmark(2);
                }
            });
        }
    });

    return (
        <>
            {signed
                ?
                <></>
                :
                <>
                    <a onClick={() => {
                        useSignIn()
                    }}>
                        Sign in
                    </a>
                </>
            }
        </>
    );
}