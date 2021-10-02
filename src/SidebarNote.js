import excerpts from 'excerpts';
import marked from 'marked';

import ClientSidebarNote from './SidebarNote.client';

export default function SidebarNote({selectedId, searchText, note, bookmarkId, isBookmark, userId, token, lang}) {
    // console.log(`SidebarNote bookmark=${isBookmark} bookmarkId=${bookmarkId} userId=${userId}  token=${token} `);
    // console.log(`SidebarNote.js lang=${lang} `);

    const id = note.id;
    const title = note.title
    const body = note.body;
    const thumbnail = note.thumbnail;

    const titleSub = title.substring(0, (title.length > 30)?30:title.length) + "...";
    const bodySub = body.substring(0, (body.length > 60)?60:body.length) + "...";

    const titleSummary = excerpts(marked(titleSub), {words: 6});
    const bodySummary = excerpts(marked(bodySub), {words: 10});

    return (
        <ClientSidebarNote
            id={id}
            selectedId={selectedId}
            title={title}
            body={body}
            isBookmark={isBookmark}
            bookmarkId={bookmarkId}
            userId={userId}
            token={token}
            lang={lang}
            searchText={searchText}
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
