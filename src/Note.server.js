import {db} from "./db.server";
import SidebarNote from "./SidebarNote";
import SidebarNote3 from "./SidebarNote3";

export default function Note({selectedId, isEditing, selectedTitle, selectedBody}) {
    if (!selectedId) {
        const notes = db.query(
            `select *
             from notes
             where title like $1
                OR body like $1
             order by updated_at desc limit 6`,
            ['%' + "" + '%']
        ).rows;

        let leftNotes = notes.filter((e, i) => i % 2 === 1);
        let rightNotes = notes.filter((e, i) => i % 2 === 0);

        if (notes) {
            return (
                <>
                    <div className="">
                        <ul className="notes-list left">
                            {leftNotes.map((note) => (
                                <li key={note.id}>
                                    <SidebarNote3 note={note}/>
                                </li>
                            ))}
                        </ul>
                        <ul className="notes-list right">
                            {rightNotes.map((note) => (
                                <li key={note.id}>
                                    <SidebarNote3 note={note}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            );
        }
    }

    const videoId = selectedId;
    const titleDecode = decodeURI(selectedTitle);
    const bodyDecode = decodeURI(selectedBody);

    const src = `https://www.youtube.com/embed/${videoId}`;

    if (isEditing) {
    } else {
        return (
            <div className="note">
                <div className="note-header">
                    <h1 className="note-title">{titleDecode}</h1>
                </div>
                <iframe width="840"
                        height="472"
                        src={src}
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                </iframe>
                <p>{bodyDecode}</p>
                <p><a href={`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`} target="_blank">Open chat</a>
                </p>
            </div>
        );
    }
}
