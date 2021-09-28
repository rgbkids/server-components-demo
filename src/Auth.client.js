import {useFirebase, useSignIn} from './fire';
import {useEffect, useState, useTransition} from "react";

import {useLocation} from './LocationContext.client';
import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

export default function Auth() {
    const [authSetting, setAuthSetting] = useState(false);
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState(null);

    // const [title, setTitle] = useState("");
    // const [body, setBody] = useState("");

    // const [location, setLocation] = useLocation();
    // const [, startNavigating] = useTransition();
    // const refresh = useRefresh();

    // function navigate(response) {
    //     const cacheKey = response.headers.get('X-Location');
    //     const nextLocation = JSON.parse(cacheKey);
    //     const seededResponse = createFromReadableStream(response.body);
    //     startNavigating(() => {
    //         refresh(cacheKey, seededResponse);
    //         setLocation(nextLocation);
    //     });
    // }

    // 登録処理
    async function handleCreate(title, body) {
        // const title = user.title;
        // const body = user.body;

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
        // navigate(response);
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
        // navigate(response);
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