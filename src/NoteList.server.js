import {db} from './db.server';
import SidebarNote from './SidebarNote';
import NoteListClient from './NoteList.client';

export default function NoteList({searchText}) {
    console.log(`NoteList s`);

    const searchTextDecode = decodeURI(searchText);

    const notes = db.query(
        `select *
         from notes
         where title like $1
            OR body like $1
         order by updated_at desc limit 20`,
        ['%' + searchTextDecode + '%']
    ).rows;

    return (
        <NoteListClient notes={notes} />
    );
}
