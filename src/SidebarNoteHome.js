import SidebarNote from "./SidebarNote";
import ClientSidebarNote from "./SidebarNoteHome.client";

export default function SidebarNoteHome({selectedId, searchText, note, isBookmark, bookmarkId, userId, token}) {
    console.log(`SidebarNoteHome selectedId=${selectedId} isBookmark=${isBookmark}, bookmarkId=${bookmarkId}, userId=${userId}  token=${token} `);

    // const videoId = note.id;
    // const src = `https://www.youtube.com/embed/${videoId}`;

    return (
        <>
            <ClientSidebarNote selectedId={selectedId} searchText={searchText} note={note} bookmarkId={bookmarkId} isBookmark={isBookmark} userId={userId} token={token} />
        </>
    );
}
