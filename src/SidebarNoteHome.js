import SidebarNote from "./SidebarNote";
import ClientSidebarNote from "./SidebarNoteHome.client";

export default function SidebarNoteHome({searchText, note, isBookmark, bookmarkId, userId}) {
    console.log(`SidebarNoteHome isBookmark=${isBookmark}, bookmarkId=${bookmarkId}, userId=${userId}`);

    // const videoId = note.id;
    // const src = `https://www.youtube.com/embed/${videoId}`;

    return (
        <>
            <ClientSidebarNote searchText={searchText} note={note} bookmarkId={bookmarkId} isBookmark={isBookmark} userId={userId} />
        </>
    );
}
