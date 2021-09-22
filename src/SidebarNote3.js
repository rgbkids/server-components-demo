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

    const videoId = id;
    const src = `https://www.youtube.com/embed/${videoId}`;

    return (
        <>
            <iframe width="504"
                    height="283"
                    src={src}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
            </iframe>
        </>
    );
}
