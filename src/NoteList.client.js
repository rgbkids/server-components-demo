import SidebarNote from './SidebarNote';

export default function NoteList({notes}) {
    console.log(`NoteList c`);

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
