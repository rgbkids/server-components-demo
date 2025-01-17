//@ts-check

import {db} from "./db.server";
import NoteClient from "./Note.client";
import NoteHome from "./NoteHome.client";
import Auth from "./Auth.client";
import Language from "./Language.client";
import {t} from './language';

export default function Note({searchText, selectedId, isEditing, selectedTitle, selectedBody, userId, token, lang}) {
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

        // TODO: もっと上のレベルで引き継げるかも（NoteList.serverにもある）
        const bookmarks = db.query(
            `select bookmark_id, video_id
             from bookmarks
             where user_id = $1`,
            [userId]
        ).rows;

        if (notes) {
            return (
                <>
                    <div className="contents">
                        <header><strong>DASHBOARD</strong></header>

                        <Auth lang={lang} signInText={t("SIGN_IN_TEXT", lang)} signOutText={t("SIGN_OUT_TEXT", lang)}/>

                        <Language searchText={searchText} selectedId={selectedId} isEditing={isEditing}
                                  selectedTitle={selectedTitle} selectedBody={selectedBody} userId={userId}
                                  token={token} lang={lang}/>

                        <NoteHome selectedId={selectedId} searchText={searchText} notes={notes} bookmarks={bookmarks}
                                  userId={userId} token={token} lang={lang}/>

                        <p>{t("HOW_TO_ADD", lang)}</p>
                        <img src="undraw_Collaborators_re_hont.png"/>

                        <p>{t("HOW_TO_WATCH", lang)}</p>
                        <img src="undraw_Online_video_re_fou2.png"/>

                        <p>{t("START_TOGETHER", lang)}</p>
                        <img src="undraw_Co-working_re_w93t.png"/>

                        <p>{t("HOW_TO_LIVE", lang)}</p>
                        <p className="annotation">{t("ABOUT_HASHTAG", lang)}</p>
                        <a href="https://apps.apple.com/app/vteacher/id1435002381" target="_blank">
                            {t("DOWNLOAD_APP", lang)}
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
                    videoId={videoId} lang={lang}/>
    );
}
