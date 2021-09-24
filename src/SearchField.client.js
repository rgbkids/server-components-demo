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
    const [isSearching, startSearching] = useTransition();
    const [, setLocation] = useLocation();

    const [text, setText] = useState('');
    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [uid, setUid] = useState("");

    useEffect(() => {
        useFirebase().auth().onAuthStateChanged(_user => {
            if (_user) {
                user = _user;

                setSigned(true);
                setEmail(user.email);
                setDisplayName(user.displayName);
                setUid(user.uid);
            }
        });
    });

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
                    ? <p className="user-name">{displayName}</p>
                    : <button onClick={() => handleSignIn()}>Sign in</button>
                }
            </div>
        </>
    );
}
