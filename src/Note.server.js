import {db} from "./db.server";
import SidebarNote3 from "./SidebarNote3";
import NoteClient from "./Note.client";
import {getKey} from "./keys";
import {fetch} from "react-fetch";

export default function Note({selectedId, isEditing, selectedTitle, selectedBody}) {

    const now = new Date();
    const notes = db.query(
        `select updated_at from notes where updated_at + interval '00:01' > $1`,
        [now]
    ).rows;

    if (notes && notes.length == 0) {
        const key = getKey();

        const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=studywithme,study-with-me,study%20with%20me`;

        const videos = fetch(endPointYouTube).json();
        const items = videos.items;

        if (items && items.length > 0) {
            items.map((item) => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const channelId = item.snippet.channelId;
                const description = item.snippet.description;
                const thumbnail = item.snippet.thumbnails.default.url;

                const titleEncode = encodeURI(title);
                const descriptionEncode = encodeURI(description);

                // TODO: GETからPOSTにする
                const endPointPost = `https://studywithme.cmsvr.live/youtube/?title=${titleEncode}&body=${descriptionEncode}&id=${videoId}&thumbnail=${thumbnail}`;

                const _ = fetch(endPointPost);
            });
        }
    }

    if (!selectedId) {
        const notes = db.query(
            `select *
             from notes
             where title like $1
                OR body like $1
             order by updated_at desc limit 20`,
            ['%' + "" + '%']
        ).rows;

        let leftNotes = notes.filter((e, i) => i % 2 === 1);
        let rightNotes = notes.filter((e, i) => i % 2 === 0);

        if (notes) {
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
    }

    const videoId = selectedId;
    const titleDecode = decodeURI(selectedTitle);
    const bodyDecode = decodeURI(selectedBody);

    const src = `https://www.youtube.com/embed/${videoId}`;
    const uri = `https://www.youtube.com/watch?v=${videoId}`;

    if (isEditing) {
    } else {
        return (
            <NoteClient title={titleDecode} body={bodyDecode} src={src} uri={uri} videoId={videoId} />
        );
    }
}
