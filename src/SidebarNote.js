import {format, isToday} from 'date-fns';
import excerpts from 'excerpts';
import marked from 'marked';

import ClientSidebarNote from './SidebarNote.client';

export default function SidebarNote({note}) {
    const updatedAt = new Date(note.updated_at);
    const lastUpdatedAt = isToday(updatedAt)
        ? format(updatedAt, 'h:mm bb')
        : format(updatedAt, 'M/d/yy');

    console.log(note);

    // const summary = excerpts(marked(note.body), {words: 20});
    const summary = note.body;

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
