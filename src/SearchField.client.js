/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useState, useTransition, useEffect} from 'react';

import {useLocation} from './LocationContext.client';
import Spinner from './Spinner';

import firebase from "firebase";
import {getDb, signIn, getAuth} from './fire';

// const db = firebase.firestore();
// db.settings({
//     timestampsInSnapshots: true
// });
// const auth = firebase.auth();
// const signIn = () => {
//     let provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithRedirect(provider);
// };
let me = null;

export default function SearchField() {

    getDb();

    async function handleSignIn() {
        signIn();
    }

    const [text, setText] = useState('');
    const [isSearching, startSearching] = useTransition();
    const [, setLocation] = useLocation();

    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        getAuth().onAuthStateChanged(user => {
            if (user) {
                me = user;

                setSigned(true);
                setEmail(me.email);
            }
        });
    });

    return (
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <label className="offscreen" htmlFor="sidebar-search-input">
                Filter for a note by title
            </label>
            <input
                id="sidebar-search-input"
                placeholder="Filter"
                value={text}
                onChange={(e) => {
                    const newText = e.target.value;
                    const newTextEncode = encodeURI(newText);

                    setText(newText);
                    startSearching(() => {
                        setLocation((loc) => ({
                            ...loc,
                            searchText: newTextEncode,
                        }));
                    });
                }}
            />
            <Spinner active={isSearching}/>
            {signed
                ? <p>{email}</p>
                : <button onClick={() => handleSignIn()}>Sign in</button>
            }
        </form>
    );
}
