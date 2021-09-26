import {useState, useEffect} from 'react';
import {useSignInPopup, useSignOut, useFirebase} from './fire';

export default function Note({title, body, src, uri, videoId}) {

    const [signed, setSigned] = useState(false);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [, setUid] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [videoIds, setVideoIds] = useState([]);
    const [bookmark, setBookmark] = useState(false);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        useFirebase().auth().onAuthStateChanged(user => {
            if (user) {
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

                        if (doc.videoIds.includes(videoId)) {
                            setBookmark(true);
                        }
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
    });

    async function handleSignIn() {
        useSignInPopup();
    }

    async function handleSignOut() {
        useSignOut();
    }

    async function handleToggleBookmark() {
        if (bookmark) {
            deleteBookmark();
        } else {
            addBookmark();
        }
    }

    function addBookmark() {
        if (!videoIds.includes(videoId)) {
            videoIds.push(videoId);
            videos.push({
                title: title,
                body: body,
                created_at: new Date(),
                updated_at: new Date(),
                id: videoId,
                thumbnail: src,
            });
        }

        const data = {
            email: email,
            videoIds: videoIds,
            memo: new Date(),
            videos: videos,
        }

        if (documentId) {
            useFirebase().firestore().collection('study-with-me').doc(documentId).update(data);
        } else {
            useFirebase().firestore().collection('study-with-me').add(data);
        }

        setVideoIds(videoIds);
        setVideos(videos);
        setBookmark(true);
    }

    function deleteBookmark() {
        const _videoIds = videoIds.filter(v => v !== videoId);
        const _videos = videos.filter(v => {
            console.log(v);
            console.log(v.id);
            return (v.id !== videoId);
        });

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
        setBookmark(false);
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
                    ?
                    <>
                        <button onClick={() => handleSignOut()}>Sign out</button>
                        <p>{displayName}:{documentId}</p>
                        {bookmark
                            ?
                            <>
                                <p>bookmarked</p>
                                <button onClick={() => handleToggleBookmark()}>-</button>
                            </>
                            :
                            <button onClick={() => handleToggleBookmark()}>+</button>
                        }
                    </>
                    :
                    <button onClick={() => handleSignIn()}>Sign in</button>
                }
            </div>
        </div>
    );
}
