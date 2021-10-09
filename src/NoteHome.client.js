//@ts-check

import SidebarNoteHome from "./SidebarNoteHome";

export default function NoteHome({selectedId, searchText, notes, bookmarks, userId, token, lang}) {
    let bookmarkValues = [];
    let bookmarkKeys = [];
    bookmarks.map((bookmark) => {
        bookmarkValues.push(bookmark.video_id);
        bookmarkKeys[bookmark.video_id] = bookmark.bookmark_id;
    });

    return (
        <>
            <div className="container">
                {notes.map((note, i) => (
                    <div key={note.id} className="item">
                        <SidebarNoteHome selectedId={selectedId} searchText={searchText} note={note}
                                         isBookmark={bookmarkValues.includes(note.id)}
                                         bookmarkId={bookmarkKeys[note.id]} userId={userId} token={token} lang={lang}/>
                    </div>
                ))}
            </div>
        </>
    );
}
