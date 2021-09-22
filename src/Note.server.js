export default function Note({selectedId, isEditing, selectedTitle, selectedBody}) {
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
        <iframe width="560"
              height="315"
              src={src}
              title="YouTube video player" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
        </iframe>
        <p>{bodyDecode}</p>
        <p><a href={`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`} target="_blank">Open chat</a></p>
      </div>
    );
  }
}
