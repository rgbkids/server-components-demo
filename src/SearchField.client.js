/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import Spinner from './Spinner';

export default function SearchField() {
    // console.log(`SearchField c`);

    const [isSearching, startSearching] = useTransition();
    const [, setLocation] = useLocation();
    const [text, setText] = useState('');

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
        </>
    );
}
