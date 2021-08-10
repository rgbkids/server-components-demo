import {db} from './db.server';
import Left from './Left.client';

export default function Hello({selectedId}) {
    const vteachers = db.query(
        `select id from vteachers where id=$1`, [selectedId]
    ).rows;

    let text = selectedId;
    vteachers.map((vteacher) => {
        text = vteacher.id;
    });

    return (
        <Left text={text} />
    );
}