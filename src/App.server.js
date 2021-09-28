import {Suspense} from 'react';

import Note from './Note.server';
import NoteList from './NoteList.server';
import SearchField from './SearchField.client';
import NoteSkeleton from './NoteSkeleton';
import NoteListSkeleton from './NoteListSkeleton';
import Auth from './Auth.client';

export default function App({selectedId, isEditing, searchText, selectedTitle, selectedBody, userId}) {
    console.log(`App userId=${userId}`);

    return (
        <div className="main">
            <section className="col sidebar">
                <section className="sidebar-header">
                    <img
                        className="logo"
                        src="logo.png"
                        width="28px"
                        height="28px"
                        alt=""
                        role="presentation"
                    />
                    <a href="/"><strong>Study with me</strong></a>
                </section>
                <section className="sidebar-promotion">
                    <a href="https://apps.apple.com/app/vteacher/id1435002381" target="_blank"><p>&#9758;Start study with me!</p></a>
                </section>
                <section className="sidebar-menu" role="menubar">
                    <SearchField/>
                </section>
                <nav>
                    <Suspense fallback={<NoteListSkeleton/>}>
                        <NoteList searchText={searchText} userId={userId}/>
                    </Suspense>
                </nav>
            </section>
            <section key={selectedId} className="col note-viewer">
                <Suspense fallback={<NoteSkeleton isEditing={isEditing}/>}>
                    <Note selectedId={selectedId} isEditing={isEditing} selectedTitle={selectedTitle} selectedBody={selectedBody} userId={userId}/>
                </Suspense>
            </section>
            <Auth />
        </div>
    );
}
