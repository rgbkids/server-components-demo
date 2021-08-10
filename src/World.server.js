import {fetch} from 'react-fetch';
import Right from './Right.client';

export default function World({selectedId}) {
    let _ = fetch(`http://localhost:4000/sleep/3000`); // 3秒の遅延

    if (!selectedId) {
        return (
            <Right />
        );
    }

    let vteacher = fetch(`http://localhost:4000/vteachers/${selectedId}`).json();
    let {title, body, updated_at} = vteacher;
    let text = `${selectedId}${title}${body}${updated_at}`;

    return (
        <Right text={text} />
    );
}