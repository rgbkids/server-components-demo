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
import {useSignIn, useFirebase} from './fire';

let user = null;

export default function SearchField() {
    const [text, setText] = useState('');
    const [isSearching, startSearching] = useTransition();
    const [, setLocation] = useLocation();
    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [uid, setUid] = useState("");

    useEffect(() => {
        useFirebase().auth().onAuthStateChanged(_user => {
            if (_user) {
                user = _user;

                console.log(user);

                setSigned(true);
                setEmail(user.email);
                setDisplayName(user.displayName);
                setUid(user.uid);

                useFirebase().firestore().collection('study-with-me').get().then((snapshot) => {
                    snapshot.forEach((document) => {
                        const doc = document.data();
                        // console.log(`---- collection('study-with-me').get() ----`);
                        // console.log(doc);
                    })
                });

                useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                    snapshot.forEach((document) => {
                        const doc = document.data();
                        console.log(`---- collection('study-with-me').where('email', '==', user.email).get() ----`);
                        console.log(document);
                        console.log(document.id);
                        console.log(doc);
                    })
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    });

    async function handleAdd() {
        if (user) {
            const data = {
                email: user.email,
            }
            useFirebase().firestore().collection('study-with-me').add(data);
        }
    }

    async function handleSignIn() {
        useSignIn();
    }

    return (
        <>
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
            </form>
            <div>
                {signed
                    ? <p>{displayName}:{uid}:{email} <button onClick={() => handleAdd()}>Add</button></p>
                    : <button onClick={() => handleSignIn()}>Sign in</button>
                }
            </div>
        </>
    );
}
