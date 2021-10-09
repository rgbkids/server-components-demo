//@ts-check

import SidebarNote from './SidebarNote';

export default function NoteList({selectedId, searchText, notes, bookmarks, userId, token, lang}) {
    let bookmarkValues = [];
    let bookmarkKeys = [];
    bookmarks.map((bookmark) => {
        bookmarkValues.push(bookmark.video_id);
        bookmarkKeys[bookmark.video_id] = bookmark.bookmark_id;
    });

    return notes.length > 0 ? (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <SidebarNote selectedId={selectedId} searchText={searchText} note={note}
                                 isBookmark={bookmarkValues.includes(note.id)} bookmarkId={bookmarkKeys[note.id]}
                                 userId={userId} token={token} lang={lang}/>
                </li>
            ))}
        </ul>
    ) : (
        <div className="notes-empty">
            No videos created yet!
        </div>
    );
}
