/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {fetch} from 'react-fetch';

import {db} from './db.server';
import SidebarNote from './SidebarNote';
import SidebarNote2 from './SidebarNote2';

export default function NoteList({searchText}) {
  // const notes = fetch('http://localhost:4000/notes').json();

  // WARNING: This is for demo purposes only.
  // We don't encourage this in real apps. There are far safer ways to access
  // data in a real application!
  const notes = db.query(
    `select * from notes where title ilike $1 order by id desc`,
    ['%' + searchText + '%']
  ).rows;

  // Now let's see how the Suspense boundary above lets us not block on this.
  // fetch('http://localhost:4000/sleep/3000');


  //youtubeliveproject
//AIzaSyCC-FYd9K-VhVZVzGOiJ_ltLPwck_1bkMc

//MyYouTubeLive
//AIzaSyDynnfe5PbvejqTdMZgvpKQv2iv0sc_DvU

//API Project
//AIzaSyAX5z9hRoHkw9esqwIhdM1n39ciG7Pv6Ck //NG:PERMISSION_DENIED
//AIzaSyA05_WDaaFa615Nequ8IA3fcXPPb7L_TH8 //OK

//内定物語
//AIzaSyDC5NU_PwIBuZl30OBusLdGwrlWBRdm_sw //NG:PERMISSION_DENIED
//AIzaSyAohHwpRfDK-CuqjZIWZot4av7is0vMT14 //OK

//My Project 10496
//AIzaSyCcrPUTAuzkKnK3w_Vr5AIOeOHKGhqf8aU //OKOK

//My Project 65263
//AIzaSyBAHQhkFqTTqWrEw23890VCOGEjQAD7bpc //OKOK

  const endPointYouTube = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyA05_WDaaFa615Nequ8IA3fcXPPb7L_TH8&part=snippet&type=video&eventType=live&&maxResults=5&order=date&q=studywithme,study-with-me,study%20with%20me`;
  const videos = fetch(endPointYouTube).json();
  const items = videos.items;

  let msg = "";
  items.map((item) => {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const channelId = item.snippet.channelId;
    const description = item.snippet.description;

    msg += videoId;

    const titleEncode = encodeURI(title);
    const descriptionEncode = encodeURI(description);

    const endPointPost = `http://localhost:4000/youtube/?title=${titleEncode}&body=${descriptionEncode}&id=${videoId}`;
    const _ = fetch(endPointPost);
    // console.log(_);

  });

  // console.log(note);
  // let {id, title, body, updated_at} = note;

  return notes.length > 0 ? (
    <ul className="notes-list">
      {/*{items.map((item) => (*/}
      {/*    <li key={item.id.videoId}>*/}
      {/*      <SidebarNote2*/}
      {/*          id={item.id.videoId}*/}
      {/*          title={item.snippet.title}*/}
      {/*          body={item.snippet.description}*/}
      {/*          thumbnail={item.snippet.thumbnails.default.url}*/}
      {/*      />*/}
      {/*    </li>*/}
      {/*))}*/}

      {notes.map((note) => (
          <li key={note.id}>
            <SidebarNote note={note} />
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
