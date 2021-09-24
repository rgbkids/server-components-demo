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

let me = null;

export default function SearchField() {
    const [text, setText] = useState('');
    const [isSearching, startSearching] = useTransition();
    const [, setLocation] = useLocation();
    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        useFirebase().auth().onAuthStateChanged(user => {
            if (user) {
                me = user;

                setSigned(true);
                setEmail(me.email);
            }
        });
    });

    async function handleSignIn() {
        useSignIn();
    }

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
