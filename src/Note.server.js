import {db} from "./db.server";
import NoteClient from "./Note.client";
import NoteHome from "./NoteHome.client";
import Auth from "./Auth.client";

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
                    <div className="contents">
                        <header>DASHBOARD</header>

                        <Auth className="auth" />

                        <NoteHome selectedId={selectedId} searchText={searchText} notes={notes} bookmarks={bookmarks} userId={userId} token={token}/>

                        <p>サイドバーから一緒に勉強したいユーザーを➕</p>
                        <img src="undraw_Collaborators_re_hont.png"/>

                        <p>ライブ配信を同時に再生しよう！</p>
                        <img src="undraw_Online_video_re_fou2.png"/>

                        <p>STUDY WITH ME! いっしょに勉強しよう！</p>
                        <img src="undraw_Co-working_re_w93t.png"/>

                        <p>VTeacherでSTUDY WITH MEの配信ができます<br/>( #STUDYWITHME のハッシュタグをつけて配信 )</p>
                        <a href="https://apps.apple.com/app/vteacher/id1435002381" target="_blank">
                            AppStoreでダウンロード
                        </a>
                        <img src="undraw_Social_bio_re_0t9u.png"/>

                    </div>
                </>
            );
        } else {
            return (
                <>
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
        <NoteClient searchText={searchText} title={titleDecode} body={bodyDecode} src={src} uri={uri}
                    videoId={videoId}/>
    );
}
