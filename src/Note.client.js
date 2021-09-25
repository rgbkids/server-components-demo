import {useState, useEffect} from 'react';
import {useSignIn, useSignOut, useFirebase} from './fire';

let user = null;

export default function Note({title, body, src, uri, videoId}) {
    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [uid, setUid] = useState("");
    const [documentId, setDocumentId] = useState("");

    useEffect(() => {
        console.log(`useEffect`);

        useFirebase().auth().onAuthStateChanged(_user => {
            console.log(`useFirebase().auth().onAuthStateChanged >>>`);
            console.log(_user);
            console.log(`<<< useFirebase().auth().onAuthStateChanged`);

            if (_user) {
                user = _user;

                // console.log(user);

                setSigned(true);
                setEmail(user.email);
                setDisplayName(user.displayName);
                setUid(user.uid);

                //-------------------------------------
                console.log(`ppp`);

                useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {

                    console.log(`1111`);

                    snapshot.forEach((document) => {
                        setDocumentId(document.id);

                        const doc = document.data();
                        // console.log(doc);
                    })
                });
                //-------------------------------------

                // ------------------------
                console.log(`dddd`);

                useFirebase().firestore().collection('study-with-me').onSnapshot(snapshot => {

                    console.log(`2222`);

                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const d = change.doc.data();
                            console.log("---------------------------");
                            console.log(change);
                            console.log(change.doc);
                            console.log(change.doc.id);
                            console.log(d);

                            setDocumentId(change.doc.id);
                        }
                    });
                }, error => {
                    console.log(error);
                });
                // ------------------------
            } else {
                user = null;

                // console.log(user);

                setSigned(false);
                setEmail("");
                setDisplayName("");
                setUid("");
            }
        });
    });

    async function handleSignIn() {
        useSignIn();
    }

    async function handleSignOut() {
        useSignOut();
    }

    async function handleAdd() {
        const data = {
            email: email,
            memo: new Date(),
        }

        if (user) {
            console.log(`1111`);

            if (documentId) {
                useFirebase().firestore().collection('study-with-me').doc(documentId).update(data);
            } else {
                useFirebase().firestore().collection('study-with-me').add(data);
            }
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
