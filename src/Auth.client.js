import {useFirebase, useSignIn} from './fire';
import {useEffect, useState} from "react";

export default function Auth() {
    const [authSetting, setAuthSetting] = useState(false);
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!authSetting) {
            setAuthSetting(true);

            useFirebase().auth().onAuthStateChanged(_user => {
                if (_user) {
                    console.log(_user);

                    setUser(_user);
                    setSigned(true);
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