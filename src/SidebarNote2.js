/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {format, isToday} from 'date-fns';
import excerpts from 'excerpts';
import marked from 'marked';

import ClientSidebarNote from './SidebarNote.client';

export default function SidebarNote({id, title, body, thumbnail}) {
    // const updatedAt = new Date(note.updated_at);
    // const lastUpdatedAt = isToday(updatedAt)
    //     ? format(updatedAt, 'h:mm bb')
    //     : format(updatedAt, 'M/d/yy');
    const lastUpdatedAt = "";

    const titleSummary = excerpts(marked(title), {words: 8});

    // const summary = body;//excerpts(marked(body), {words: 20});
    const bodySummary = excerpts(marked(body), {words: 18});

    const videoId = id;
    const videoUrl = `https://www.youtube.com/watch?v={videoId}`;

    return (
        <ClientSidebarNote
            id={id}
            title={title}
            body={body}
            expandedChildren={
                <p className="sidebar-note-excerpt">{bodySummary || <i>(No content)</i>}</p>
            }>
            <header className="sidebar-note-header">
                <img src={thumbnail} className="sidebar-note-thumbnail left" />
                <small className="right">{titleSummary}</small>
            </header>
        </ClientSidebarNote>
    );
}
