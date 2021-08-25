import {fetch} from 'react-fetch';
import FormerClient from './Former.client';

const PORT = process.env.PORT;
const HOST = process.env.HOST;

export default function Former({selectedId}) {
    const vteacher =
        selectedId != null
            ? fetch(`http://${HOST}:${PORT}/vteachers/${selectedId}`).json()
            : null;

    if (!vteacher) {
        return <FormerClient id={null} initialTitle={""} initialBody={""} />;
    }

    let {id, title, body} = vteacher;

    return <FormerClient id={id} initialTitle={title} initialBody={body} />;

}