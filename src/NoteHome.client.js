import {useState} from 'react';
import SidebarNoteHome from "./SidebarNoteHome";
import SidebarNote from "./SidebarNote";

export default function NoteHome({notes, bookmarks, userId}) {
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

    const [leftNotes, setLeftNotes] = useState(notes.filter((e, i) => i % 2 === 0));
    const [rightNotes, setRightNotes] = useState(notes.filter((e, i) => i % 2 === 1));
    // const [leftNotes, setLeftNotes] = useState();
    // const [rightNotes, setRightNotes] = useState();

    return (
        <>
            <div className="">
                <ul className="notes-list left">
                    {leftNotes
                        ?
                        <>
                            {leftNotes.map((note) => (
                                <li key={note.id}>
                                    <SidebarNoteHome note={note} isBookmark={bookmarkValues.includes(note.id)} bookmarkId={bookmarkKeys[note.id]} userId={userId}/>
                                </li>
                            ))}
                        </>
                        :
                        <>
                        </>
                    }
                </ul>
                <ul className="notes-list right">
                    {rightNotes
                        ?
                        <>
                            {rightNotes.map((note) => (
                                <li key={note.id}>
                                    <SidebarNoteHome note={note} isBookmark={bookmarkValues.includes(note.id)} bookmarkId={bookmarkKeys[note.id]} userId={userId}/>
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
