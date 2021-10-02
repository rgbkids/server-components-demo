import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import Spinner from './Spinner';

export default function SearchField() {
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
