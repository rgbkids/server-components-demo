import {useState, useEffect} from 'react';
import SidebarNoteHome from "./SidebarNoteHome";
import {useFirebase} from './fire';

export default function NoteHome({notes}) {
    console.log(`NoteHome`);

    const [document, setDocument] = useState();
    const [leftNotes, setLeftNotes] = useState(notes.filter((e, i) => i % 2 === 0));
    const [rightNotes, setRightNotes] = useState(notes.filter((e, i) => i % 2 === 1));

    useEffect(() => {
        console.log(`NoteHome useEffect`);

        if (!document) {
            useFirebase().auth().onAuthStateChanged(user => {
                console.log(`NoteHome useEffect useFirebase`);

                if (user) {
                    useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                        snapshot.forEach((document) => {
                            const doc = document.data();

                            if (doc.videos.length > 0) {
                                setLeftNotes(doc.videos.filter((e, i) => i % 2 === 0));
                                setRightNotes(doc.videos.filter((e, i) => i % 2 === 1));
                            }
                            setDocument(document);
                        })
                    });
                }
            });
        }
    });

    return (
        <>
            <div className="">
                <ul className="notes-list left">
                    {leftNotes.map((note) => (
                        <li key={note.id}>
                            <SidebarNoteHome note={note}/>
                        </li>
                    ))}
                </ul>
                <ul className="notes-list right">
                    {rightNotes.map((note) => (
                        <li key={note.id}>
                            <SidebarNoteHome note={note}/>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
