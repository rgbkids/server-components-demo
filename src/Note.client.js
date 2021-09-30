import {useTransition} from 'react';
import {useLocation} from "./LocationContext.client";

export default function Note({searchText, title, body, src, uri, videoId}) {
    console.log(`Note c`);

    const [, startTransition] = useTransition();
    const [, setLocation] = useLocation();

    return (
        <div className="note">
            <button onClick={() => {
                startTransition(() => {
                    setLocation((loc) => ({
                        selectedId: "",
                        isEditing: false,
                        searchText: loc.searchText,
                        selectedTitle: "",
                        selectedBody: "",
                        userId: loc.userId,
                        token: loc.token,
                    }));
                });
            }}>
                DASHBOARD
            </button>
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
        </div>
    );
}
