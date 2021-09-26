import excerpts from 'excerpts';
import marked from 'marked';

import ClientSidebarNote from './SidebarNote.client';

export default function SidebarNote({note}) {
    const id = note.id;
    const title = note.title;
    const body = note.body;
    const thumbnail = note.thumbnail;

    const titleSummary = excerpts(marked(note.title), {words: 8});
    const bodySummary = excerpts(marked(note.body), {words: 18});

    return (
        <ClientSidebarNote
            id={id}
            title={title}
            body={body}
            expandedChildren={
                <p className="sidebar-note-excerpt">{bodySummary || <i>(No content)</i>}</p>
            }>
            <header className="sidebar-note-header">
                <img src={thumbnail} className="sidebar-note-thumbnail left"/>
                <small className="right">{titleSummary}</small>
            </header>
        </ClientSidebarNote>
    );
}
