import {fetch} from 'react-fetch';
import Right from './Right.client';

const PORT = 4000;//process.env.PORT;

export default function World({selectedId}) {
    let _ = fetch(`http://vteacher.cmsvr.live:${PORT}/sleep/3000`);

    if (!selectedId) {
        return (
            <Right />
        );
    }

    let vteacher = fetch(`http://vteacher.cmsvr.live:${PORT}/vteachers/${selectedId}`).json();
    let {title, body, updated_at} = vteacher;
    let text = `${selectedId}${title}${body}${updated_at}`;

    return (
        <Right text={text} />
    );
}