import {db} from "./db.server";
import NoteClient from "./Note.client";
import NoteHome from "./NoteHome.client";
import {getKey} from "./keys";
import {fetch} from "react-fetch";

export default function Note({selectedId, isEditing, selectedTitle, selectedBody, userId}) {
    console.log(`Note s selectedId=${selectedId} isEditing=${isEditing} selectedTitle=${selectedTitle} selectedBody=${selectedBody} userId=${userId}`);

    const host = process.env.HOST;

    const notes = db.query(
        `select updated_at
         from notes
         where to_char(updated_at, 'yyyy/mm/dd HH24:MI') <
               to_char(CURRENT_DATE - interval '1 minutes', 'yyyy/mm/dd HH24:MI')
         order by updated_at desc limit 1`
    ).rows;

    if (notes && notes.length > 0) {
        const key = getKey();
        const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=studywithme,study-with-me,study%20with%20me`;
        const videos = fetch(endPointYouTube).json();
        const items = videos.items;

        if (items && items.length > 0) {
            // console.log(items);

            if (items.map) {
                items.map((item) => {
                    const videoId = item.id.videoId;
                    const title = item.snippet.title;
                    const channelId = item.snippet.channelId;
                    const description = item.snippet.description;
                    const thumbnail = item.snippet.thumbnails.default.url;

                    const titleEncode = encodeURI(title);
                    const descriptionEncode = encodeURI(description);

                    const endPoint = `https://${host}/sync/?title=${titleEncode}&body=${descriptionEncode}&id=${videoId}&thumbnail=${thumbnail}`;
                    fetch(endPoint);
                });
            }
        }
    }

    // if (!selectedId)
    // if (isEditing != selectedId)
    {
        // const notes = db.query(
        //     `select *
        //      from notes
        //      where title like $1
        //         OR body like $1
        //      order by updated_at desc limit 20`,
        //     ['%' + "" + '%']
        // ).rows;

        const notes = db.query(
            `select *
             from bookmarks as b, notes as n 
             where b.video_id = n.id and b.user_id = $1
             order by b.updated_at desc`,
            [userId]
        ).rows;

        console.log(notes);

        // TODO: もっと上のレベルで引き継げるかも
        const bookmarks = db.query(
            `select bookmark_id, video_id
         from bookmarks
         where user_id = $1`,
            [userId]
        ).rows;
        console.log(bookmarks);

        if (notes) {
            return (
                <>
                    <NoteHome notes={notes} bookmarks={bookmarks} userId={userId} />
                </>
            );
        }
    }

    const videoId = selectedId;
    const titleDecode = decodeURI(selectedTitle);
    const bodyDecode = decodeURI(selectedBody);

    const src = `https://www.youtube.com/embed/${videoId}`;
    const uri = `https://www.youtube.com/watch?v=${videoId}`;

    // if (false && isEditing) {
    // } else {
    return (
        <NoteClient title={titleDecode} body={bodyDecode} src={src} uri={uri} videoId={videoId}/>
        // <NoteHome notes={null}/>
    );
    // }
}
