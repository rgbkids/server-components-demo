import {useState, useEffect} from 'react';
import {useSignIn, useSignInPopup, useSignOut, useFirebase} from './fire';

export default function Note({title, body, src, uri, videoId}) {
    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [uid, setUid] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [videoIds, setVideoIds] = useState([]);

    useEffect(() => {
        useFirebase().auth().onAuthStateChanged(user => {
            if (user) {
                setSigned(true);
                setEmail(user.email);
                setDisplayName(user.displayName);
                setUid(user.uid);

                //-------------------------------------
                useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                    snapshot.forEach((document) => {
                        setDocumentId(document.id);
                        const doc = document.data();
                        setVideoIds(doc.videoIds);
                    })
                });
                //-------------------------------------

                // ------------------------
                useFirebase().firestore().collection('study-with-me').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const d = change.doc.data();
                            setDocumentId(change.doc.id);
                        }
                    });
                });
                // ------------------------
            } else {
                setSigned(false);
                setEmail("");
                setDisplayName("");
                setUid("");
            }
        });
    });

    async function handleSignIn() {
        useSignInPopup();
    }

    async function handleSignOut() {
        useSignOut();
    }

    async function handleAdd() {
        if (!videoIds.includes(videoId)) {
            videoIds.push(videoId);
        }

        const data = {
            email: email,
            videoIds: videoIds,
            memo: new Date(),
        }

        if (documentId) {
            useFirebase().firestore().collection('study-with-me').doc(documentId).update(data);
        } else {
            useFirebase().firestore().collection('study-with-me').add(data);
        }
    }

    return (
        <div className="note">
            <div className="note-header">
                <h1 className="note-title">{title}</h1>
            </div>
            <iframe width="840"
                    height="472"
                    src={src}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
            </iframe>
            <p>{body} <a href={uri} target="_blank">more</a></p>
            <p><a href={`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`} target="_blank">Open chat</a>
            </p>
            <div>
                {signed
                    ? <p>{displayName}:{documentId}<button onClick={() => handleAdd()}>Add</button><button onClick={() => handleSignOut()}>Sign out</button></p>
                    : <button onClick={() => handleSignIn()}>Sign in</button>
                }
            </div>
        </div>
    );
}
