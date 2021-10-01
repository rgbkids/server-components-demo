import {db} from './db.server';
import SidebarNote from './SidebarNote';
import NoteListClient from './NoteList.client';

export default function NoteList({selectedId, searchText, userId, token, lang}) {
    // console.log(`NoteList s userId=${userId}  token=${token} `);
    console.log(`NoteList server lang=${lang}`);

    const searchTextDecode = decodeURI(searchText);

    const notes = db.query(
        `select *
         from notes
         where title like $1
            OR body like $1
         order by updated_at desc limit 100`,
        ['%' + searchTextDecode + '%']
    ).rows;

    const bookmarks = db.query(
        `select bookmark_id, video_id
         from bookmarks
         where user_id = $1`,
        [userId]
    ).rows;

    return (
        <NoteListClient selectedId={selectedId} searchText={searchText} notes={notes} bookmarks={bookmarks} userId={userId} token={token} lang={lang} />
    );
}
