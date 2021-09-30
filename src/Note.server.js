import {db} from "./db.server";
import NoteClient from "./Note.client";
import NoteHome from "./NoteHome.client";

export default function Note({searchText, selectedId, isEditing, selectedTitle, selectedBody, userId, token}) {
    console.log(`Note s selectedId=${selectedId} isEditing=${isEditing} selectedTitle=${selectedTitle} selectedBody=${selectedBody} userId=${userId}  token=${token} `);

    if (!isEditing) {
        const notes = db.query(
            `select *
             from bookmarks as b,
                  notes as n
             where b.video_id = n.id
               and b.user_id = $1
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
                    <NoteHome selectedId={selectedId} searchText={searchText} notes={notes} bookmarks={bookmarks} userId={userId} token={token}/>
                </>
            );
        }
    }

    const videoId = selectedId;
    const titleDecode = decodeURI(selectedTitle);
    const bodyDecode = decodeURI(selectedBody);

    const src = `https://www.youtube.com/embed/${videoId}`;
    const uri = `https://www.youtube.com/watch?v=${videoId}`;

    return (
        <NoteClient searchText={searchText} title={titleDecode} body={bodyDecode} src={src} uri={uri} videoId={videoId}/>
    );
}
