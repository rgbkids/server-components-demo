import {fetch} from 'react-fetch';
import Right from './Right.client';

const PORT = process.env.PORT;
const HOST = process.env.HOST;

export default function World({selectedId}) {
    let _ = fetch(`http://${HOST}:${PORT}/sleep/3000`);

    if (!selectedId) {
        return (
            <Right />
        );
    }

    let vteacher = fetch(`http://${HOST}:${PORT}/vteachers/${selectedId}`).json();
    let {title, body, updated_at} = vteacher;
    let text = `${selectedId}${title}${body}${updated_at}`;

    return (
        <Right text={text} />
    );
}