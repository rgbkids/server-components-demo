import {useFirebase, useSignIn, useSignOut} from './firebase';
import {useEffect, useState, useTransition} from "react";
import {useLocation} from "./LocationContext.client";
import Spinner from './Spinner';
import {useRefresh} from "./Cache.client";
import {createFromReadableStream} from "react-server-dom-webpack";

const host = location.host;
const protocol = location.protocol;

export default function Auth({lang, signInText, signOutText}) {
    // console.log(`Auth client lang=${lang} signInText=${signInText} signOutText=${signOutText}`);

    const [location, setLocation] = useLocation();
    const [isPending, startTransition] = useTransition();

    const [authSetting, setAuthSetting] = useState(false);
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState(null);
    const [spinning, setSpinning] = useState(true);

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

    async function handleCreateUser(user_id, token, lang) {
        let _lang = (lang) ? lang : localStorage.getItem("lang");

        const payload = {user_id, token};
        const requestedLocation = {
            selectedId: "",
            isEditing: false,
            searchText: "",
            selectedTitle: "",
            selectedBody: "",
            userId: user_id,
            token: token,
            lang: _lang,
        };
        const endpoint = `${protocol}//${host}/users/`;
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
        navigate(response);
    }

    useEffect(() => {
        if (!authSetting) {
            setAuthSetting(true);

            useFirebase().auth().onAuthStateChanged(_user => {
                setSpinning(false);

                if (_user) {
                    setUser(_user);
                    setSigned(true);

                    const tokenEncode = encodeURI(_user.refreshToken);
                    let _lang = (lang) ? lang : localStorage.getItem("lang");

                    handleCreateUser(_user.uid, tokenEncode, _lang);
                }
            });
        }
    });

    async function handleSignIn() {
        setSpinning(true);
        useSignIn();
    }

    async function handleSignOut() {
        setSpinning(true);

        useSignOut();

        setAuthSetting(false);
        setSigned(false);
        setUser(null);

        let _lang = (lang) ? lang : localStorage.getItem("lang");

        startTransition(() => {
            setLocation((loc) => ({
                selectedId: "",
                isEditing: false,
                searchText: "",
                selectedTitle: "",
                selectedBody: "",
                userId: "",
                token: "",
                lang: _lang,
            }));
        });
    }

    return (
        <div className="auth">
            {signed
                ?
                <>
                    <a onClick={() => {
                        handleSignOut()
                    }}>
                        {spinning
                            ?
                            <span><Spinner active={spinning}/></span>
                            :
                            <>
                                <span className="auth-button-sign-out">{signOutText}</span>
                            </>
                        }
                    </a>
                </>
                :
                <>
                    <a onClick={() => {
                        handleSignIn()
                    }}>
                        {spinning
                            ?
                            <span><Spinner active={spinning}/></span>
                            :
                            <>
                                <span className="auth-button">{signInText}</span>
                            </>
                        }
                    </a>
                </>
            }
        </div>
    );
}