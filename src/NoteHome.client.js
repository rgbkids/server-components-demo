import {useState, useEffect} from 'react';
import SidebarNoteHome from "./SidebarNoteHome";
import {useFirebase} from './fire';

export default function NoteHome({notes}) {
    console.log(`NoteHome`);

    // const [document, setDocument] = useState();

    // const [leftNotes, setLeftNotes] = useState(notes.filter((e, i) => i % 2 === 0));
    // const [rightNotes, setRightNotes] = useState(notes.filter((e, i) => i % 2 === 1));
    const [leftNotes, setLeftNotes] = useState();
    const [rightNotes, setRightNotes] = useState();

    const [signed, setSigned] = useState(false);
    // const [bookmark, setBookmark] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [, setUid] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [videoIds, setVideoIds] = useState([]);
    const [videos, setVideos] = useState([]);

    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        console.log(`NoteHome c useEffect`);
        if (!authed) {
            console.log(`NoteHome c useEffect !authed`);

            setAuthed(true);

            useFirebase().auth().onAuthStateChanged(user => {

                console.log(`NoteHome c useEffect !authed onAuthStateChanged`);

                if (user) {
                    console.log(`NoteHome c useEffect !authed onAuthStateChanged !authed user`);

                    setSigned(true);
                    setEmail(user.email);
                    setDisplayName(user.displayName);
                    setUid(user.uid);

                    useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                        snapshot.forEach((document) => {
                            setDocumentId(document.id);
                            const doc = document.data();
                            setVideoIds(doc.videoIds);
                            setVideos(doc.videos);

                            // if (doc.videoIds.includes(videoId)) {
                            //     setBookmark(true);
                            // }
                        })
                    });

                    useFirebase().firestore().collection('study-with-me').onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(change => {
                            if (change.type === 'added') {
                                const d = change.doc.data();
                                setDocumentId(change.doc.id);
                            }
                        });
                    });
                } else {
                    setSigned(false);
                    setEmail("");
                    setDisplayName("");
                    setUid("");
                }
            });
        }
    });

    // async function handleToggleBookmark(note) {
    //     if (bookmark) {
    //         deleteBookmark(note);
    //     } else {
    //         addBookmark(note);
    //     }
    // }

    async function handleAddBookmark(note) {
        console.log(videoIds);
        console.log(videos);

        let _videoIds = videoIds.concat([]);
        let _videos = videos.concat([]);

        console.log(_videoIds);
        console.log(_videos);
        console.log(documentId);

        const videoId = note.id;
        const title = note.title;
        const body = note.body;
        const src = "";

        if (!_videoIds.includes(videoId)) {
            _videoIds.push(videoId);
            _videos.push({
                title: title,
                body: body,
                created_at: new Date(),
                updated_at: new Date(),
                id: videoId,
                thumbnail: src,
            });
        }

        console.log(_videoIds);
        console.log(_videos);

        const data = {
            email: email,
            videoIds: _videoIds,
            memo: new Date(),
            videos: _videos,
        }

        if (documentId) {
            useFirebase().firestore().collection('study-with-me').doc(documentId).update(data);
        } else {
            useFirebase().firestore().collection('study-with-me').add(data);
        }

        setVideoIds(_videoIds);
        setVideos(_videos);
        // setBookmark(true);
    }

    async function handleDeleteBookmark(note) {
        const videoId = note.id;

        console.log(videoId);
        console.log(videoIds);

        const _videoIds = videoIds.filter(v => v !== videoId);
        const _videos = videos.filter(v => {
            console.log(v);
            console.log(v.id);
            return (v.id !== videoId);
        });

        console.log(_videoIds);

        const data = {
            email: email,
            videoIds: _videoIds,
            memo: new Date(),
            videos: _videos,
        }

        if (documentId) {
            useFirebase().firestore().collection('study-with-me').doc(documentId).update(data);
        } else {
            useFirebase().firestore().collection('study-with-me').add(data);
        }

        setVideoIds(_videoIds);
        setVideos(_videos);
        // setBookmark(false);
    }

    useEffect(() => {
        console.log(`NoteHome useEffect`);
        if (!authed) {
            console.log(`NoteHome useEffect !authed`);

            setAuthed(true);

            // if (!document) {
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
                                // setDocument(document);
                            })
                        });
                    }
                });
            // }
        }

        return () => {
        };
    });

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
                                    <div>
                                        {signed
                                            ?
                                            <>
                                                {videoIds.includes(note.id)
                                                    ?
                                                    <>
                                                        <p>bookmarked</p>
                                                        <button onClick={() => handleDeleteBookmark(note)}>-</button>
                                                    </>
                                                    :
                                                    <button onClick={() => handleAddBookmark(note)}>+</button>
                                                }
                                            </>
                                            :
                                            <p></p>
                                        }
                                    </div>
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
                                    <div>
                                        {signed
                                            ?
                                            <>
                                                {videoIds.includes(note.id)
                                                    ?
                                                    <>
                                                        <p>bookmarked</p>
                                                        <button onClick={() => handleDeleteBookmark(note)}>-</button>
                                                    </>
                                                    :
                                                    <button onClick={() => handleAddBookmark(note)}>+</button>
                                                }
                                            </>
                                            :
                                            <p></p>
                                        }
                                    </div>
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
