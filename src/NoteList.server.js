import {db} from './db.server';
import SidebarNote from './SidebarNote';

export default function NoteList({searchText}) {
    const searchTextDecode = decodeURI(searchText);

    const notes = db.query(
        `select *
         from notes
         where title like $1
            OR body like $1
         order by updated_at desc limit 20`,
        ['%' + searchTextDecode + '%']
    ).rows;

    return notes.length > 0 ? (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <SidebarNote note={note}/>
                </li>
            ))}
        </ul>
    ) : (
        <div className="notes-empty">
            {searchText
                ? `Couldn't find any descriptions "${searchText}".`
                : 'No notes created yet!'}{' '}
        </div>
    );
}
