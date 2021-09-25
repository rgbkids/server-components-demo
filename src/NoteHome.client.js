import {useState, useEffect} from 'react';
import SidebarNote3 from "./SidebarNote3";
import {useFirebase} from './fire';

export default function NoteHome({notes}) {
    // const [videoIds, setVideoIds] = useState([]);

    // const [leftNotes, setLeftNotes] = useState(notes.filter((e, i) => i % 2 === 0));
    // const [rightNotes, setRightNotes] = useState(notes.filter((e, i) => i % 2 === 1));

    const [leftNotes, setLeftNotes] = useState([]);
    const [rightNotes, setRightNotes] = useState([]);

    useEffect(() => {
        setLeftNotes(notes.filter((e, i) => i % 2 === 0));
        setRightNotes(notes.filter((e, i) => i % 2 === 1));

        useFirebase().auth().onAuthStateChanged(user => {
            if (user) {
                useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                    snapshot.forEach((document) => {
                        const doc = document.data();

                        if (doc.videos.length > 0) {
                            setLeftNotes(doc.videos.filter((e, i) => i % 2 === 0));
                            setRightNotes(doc.videos.filter((e, i) => i % 2 === 1));
                        }
                    })
                });
            }
        });
    });

    // let leftNotes = notes.filter((e, i) => i % 2 === 0);
    // let rightNotes = notes.filter((e, i) => i % 2 === 1);

    return (
        <>
            <div className="">
                <ul className="notes-list left">
                    {leftNotes.map((note) => (
                        <li key={note.id}>
                            <SidebarNote3 note={note}/>
                        </li>
                    ))}
                </ul>
                <ul className="notes-list right">
                    {rightNotes.map((note) => (
                        <li key={note.id}>
                            <SidebarNote3 note={note}/>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
