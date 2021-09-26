export default function SidebarNoteHome({note}) {
    console.log(`SidebarNoteHome`);

    const videoId = note.id;
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
