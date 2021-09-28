import {db} from './db.server';
import SidebarNote from './SidebarNote';
import NoteListClient from './NoteList.client';

export default function NoteList({searchText, userId}) {
    console.log(`NoteList s userId=${userId}`);

    const searchTextDecode = decodeURI(searchText);

    const notes = db.query(
        `select *
         from notes
         where title like $1
            OR body like $1
         order by updated_at desc limit 20`,
        ['%' + searchTextDecode + '%']
    ).rows;

    const bookmarks = db.query(
        `select bookmark_id, video_id
         from bookmarks
         where user_id = $1`,
        [userId]
    ).rows;

    return (
        <NoteListClient notes={notes} bookmarks={bookmarks} userId={userId} />
    );
}
