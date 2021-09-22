/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {Suspense} from 'react';

import Note from './Note.server';
import NoteList from './NoteList.server';
import EditButton from './EditButton.client';
import SearchField from './SearchField.client';
import NoteSkeleton from './NoteSkeleton';
import NoteListSkeleton from './NoteListSkeleton';
import {fetch} from "react-fetch";

export default function App({selectedId, isEditing, searchText, selectedTitle, selectedBody}) {

  const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBAHQhkFqTTqWrEw23890VCOGEjQAD7bpc&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=studywithme,study-with-me,study%20with%20me`;
  // const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBAHQhkFqTTqWrEw23890VCOGEjQAD7bpc&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=vtuber`;

  const videos = fetch(endPointYouTube).json();
  const items = videos.items;

  if (items.length > 0) {
    items.map((item) => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const channelId = item.snippet.channelId;
      const description = item.snippet.description;
      const thumbnail = item.snippet.thumbnails.default.url;

      const titleEncode = encodeURI(title);
      const descriptionEncode = encodeURI(description);

      const endPointPost = `http://localhost:4000/youtube/?title=${titleEncode}&body=${descriptionEncode}&id=${videoId}&thumbnail=${thumbnail}`;
      const _ = fetch(endPointPost);
      // console.log(_);
    });
  }

  return (
    <div className="main">
      <section className="col sidebar">
        <section className="sidebar-header">
            <img
              className="logo"
              src="logo.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <a href={`http://localhost:4000/`}><strong>Study with me</strong></a>
        </section>
        <section className="sidebar-menu" role="menubar">
          <SearchField />
        </section>
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <NoteList searchText={searchText} />
          </Suspense>
        </nav>
      </section>
      <section key={selectedId} className="col note-viewer">
        <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
          <Note selectedId={selectedId} isEditing={isEditing} selectedTitle={selectedTitle} selectedBody={selectedBody} />
        </Suspense>
      </section>
    </div>
  );
}
