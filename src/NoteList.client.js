import SidebarNote from './SidebarNote';

export default function NoteList({selectedId, searchText, notes, bookmarks, userId}) {
    console.log(`NoteList c`);

    // console.log(`bookmarks------------`);
    // console.log(bookmarks);

    // TODO: シンプルにできないか？
    let bookmarkValues = [];
    let bookmarkKeys = [];
    bookmarks.map((bookmark) => {
        bookmarkValues.push(bookmark.video_id);
        bookmarkKeys[bookmark.video_id] = bookmark.bookmark_id;
    });

    console.log(bookmarkValues);
    console.log(bookmarkKeys);

    // notes.map((note) => {
    //     console.log(`notes.map((note) ------------`);
    //     console.log(note.id);
    //     console.log(bookmarkValues.includes(note.id));
    // });

    return notes.length > 0 ? (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <SidebarNote selectedId={selectedId} searchText={searchText} note={note} isBookmark={bookmarkValues.includes(note.id)} bookmarkId={bookmarkKeys[note.id]} userId={userId}/>
                </li>
            ))}
        </ul>
    ) : (
        <div className="notes-empty">
            No videos created yet!
        </div>
    );
}
