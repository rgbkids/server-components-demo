import ClientSidebarNote from "./SidebarNoteHome.client";

export default function SidebarNoteHome({selectedId, searchText, note, isBookmark, bookmarkId, userId, token, lang}) {
    return (
        <>
            <ClientSidebarNote selectedId={selectedId} searchText={searchText} note={note} bookmarkId={bookmarkId}
                               isBookmark={isBookmark} userId={userId} token={token} lang={lang}/>
        </>
    );
}
