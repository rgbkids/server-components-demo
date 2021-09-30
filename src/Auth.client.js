import {useFirebase, useSignIn} from './fire';
import {useEffect, useState, useTransition} from "react";
import {useLocation} from "./LocationContext.client";

const host = location.host;
const protocol = location.protocol;

export default function Auth() {
    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();

    const [authSetting, setAuthSetting] = useState(false);
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState(null);

    async function handleCreateUser(user_id, token) {
        const payload = {user_id, token};
        // const requestedLocation = {
        //     // selectedId: "",
        //     // isEditing: false,
        //     // searchText: "",
        //     // selectedTitle: "",
        //     // selectedBody: "",
        //     // userId: user_id,
        //     // token: token,
        // };
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
        console.log(response);
    }

    // 更新処理
    // async function handleUpdateUser(user_id, token) {
    //     const payload = {user_id, token};
    //     const requestedLocation = {
    //         selectedId: "",
    //         isEditing: false,
    //         searchText: "",
    //         selectedTitle: "",
    //         selectedBody: "",
    //         userId: userId,
    //         token: token,
    //     };
    //     const endpoint = `${protocol}//${host}/users/${id}`;
    //     const method = `PUT`;
    //     const response = await fetch(
    //         `${endpoint}?location=${encodeURIComponent(JSON.stringify(requestedLocation))}`,
    //         {
    //             method,
    //             body: JSON.stringify(payload),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         }
    //     );
    //     console.log(response);
    // }

    async function handleAddBookmark(user_id, video_id) {
        const payload = {user_id, video_id};
        const requestedLocation = {
            // selectedId: "",
            // isEditing: false,
            // searchText: "",
            // selectedTitle: "",
            // selectedBody: "",
            // userId: "",
            // token: "",
        };
        const endpoint = `${protocol}//${host}/bookmarks/`;
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
            // selectedId: "",
            // isEditing: false,
            // searchText: "",
            // selectedTitle: "",
            // selectedBody: "",
            // userId: "",
            // token: "",
        };
        const endpoint = `${protocol}//${host}/bookmarks/${id}`;
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

                    const tokenEncode = encodeURI(_user.refreshToken);

                    handleCreateUser(_user.uid, tokenEncode);
                    // handleCreate(_user.uid, tokenEncode);

                    // handleAddBookmark(_user.uid, `videoId1`);
                    // handleDeleteBookmark(2);

                    console.log(`Auth ------------------------------ userId=${_user.uid} token=${tokenEncode} `);
                    startTransition(() => {
                        setLocation((loc) => ({
                            selectedId: "",
                            isEditing: false,
                            searchText: "",
                            selectedTitle: "",
                            selectedBody: "",
                            userId: _user.uid,
                            token: tokenEncode
                        }));
                    });
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