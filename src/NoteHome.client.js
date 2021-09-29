import {useState} from 'react';
// import SidebarNoteHome from "./SidebarNoteHome.client";
import SidebarNoteHome from "./SidebarNoteHome";
import SidebarNote from "./SidebarNote";

export default function NoteHome({ selectedId, searchText, notes, bookmarks, userId}) {
    console.log(`NoteHome`);

    // TODO: シンプルにできないか？
    let bookmarkValues = [];
    let bookmarkKeys = [];
    bookmarks.map((bookmark) => {
        bookmarkValues.push(bookmark.video_id);
        bookmarkKeys[bookmark.video_id] = bookmark.bookmark_id;
    });

    console.log(bookmarkValues);
    console.log(bookmarkKeys);

    // const [leftNotes, setLeftNotes] = useState(notes.filter((e, i) => i % 2 === 0));
    // const [rightNotes, setRightNotes] = useState(notes.filter((e, i) => i % 2 === 1));
    // const [leftNotes, setLeftNotes] = useState();
    // const [rightNotes, setRightNotes] = useState();

    // const getNextIdForDelete = (i) => {
    //     let nextId = "";
    //     if (notes) {
    //         if (notes.length == 1) {
    //             nextId = "";
    //         } else if (i == 0) {
    //             const note = notes[1];
    //             console.log(note);
    //             nextId = note.id;
    //         } else {
    //             const note = notes[notes.length - 2];
    //             console.log(note);
    //             nextId = note.id;
    //         }
    //     }
    //     return nextId;
    // };

    return (
        <>
            <div className="dashboard">
                <ul className="notes-list">
                    {notes
                        ?
                        <>
                            {notes.map((note, i) => (
                                <li key={note.id}>
                                    <SidebarNoteHome selectedId={selectedId} searchText={searchText} note={note} isBookmark={bookmarkValues.includes(note.id)} bookmarkId={bookmarkKeys[note.id]} userId={userId}/>
                                </li>
                            ))}
                        </>
                        :
                        <>
                        </>
                    }
                </ul>
            </div>
        </>
    );
}
