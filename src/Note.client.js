import {useState, useEffect} from 'react';
import {useSignIn, useFirebase} from './fire';

let user = null;

export default function Note({title, body, src, uri, videoId}) {
    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [uid, setUid] = useState("");

    useEffect(() => {
        useFirebase().auth().onAuthStateChanged(_user => {
            if (_user) {
                user = _user;

                // console.log(user);

                setSigned(true);
                setEmail(user.email);
                setDisplayName(user.displayName);
                setUid(user.uid);

                //-------------------------------------
                useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                    snapshot.forEach((document) => {
                        const doc = document.data();
                        // console.log(`---- collection('study-with-me').where('email', '==', user.email).get() ----`);
                        // console.log(document);
                        // console.log(document.id);
                        // console.log(doc);


                        //-------------------------------------
                        useFirebase().firestore().collection('study-with-me').doc(document.id).get().then((_snapshot) => {
                            // _snapshot.forEach((_document) => {
                                const _doc = _snapshot.data();
                                console.log(`---- document.id.get() ----`);
                                console.log(_snapshot);
                                console.log(_doc);
                            // })

                            const data = {
                                email: user.email,
                                memo: new Date(),
                            }
                            useFirebase().firestore().collection('study-with-me').doc(document.id).update(data);

                        }).catch((error) => {
                            console.log(error);
                        });
                        //-------------------------------------

                    })
                }).catch((error) => {
                    console.log(error);
                });
                //-------------------------------------


            }
        });
    });

    async function handleSignIn() {
        useSignIn();
    }

    async function handleAdd() {
        if (user) {
            useFirebase().firestore().collection('study-with-me').where('email', '==', user.email).get().then((snapshot) => {
                snapshot.forEach((document) => {
                    const doc = document.data();
                    console.log(`---- collection('study-with-me').where('email', '==', user.email).get() ----`);
                    console.log(document);
                    console.log(document.id);
                    console.log(doc);
                })
            }).catch((error) => {
                console.log(error);
            });

            const data = {
                email: user.email,
            }
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
                    ? <p>{displayName}<button onClick={() => handleAdd()}>Add</button></p>
                    : <button onClick={() => handleSignIn()}>Sign in</button>
                }
            </div>
        </div>
    );
}
