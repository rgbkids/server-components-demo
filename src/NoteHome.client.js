import {useState} from 'react';
import SidebarNoteHome from "./SidebarNoteHome";

export default function NoteHome({notes}) {
    console.log(`NoteHome`);

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
                                    <SidebarNoteHome note={note}/>
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
                                    <SidebarNoteHome note={note}/>
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
