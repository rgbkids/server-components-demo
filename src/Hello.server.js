import Left from './Left.client';
import {fetch} from 'react-fetch';

export default function Hello({selectedId}) {

    let text = selectedId;

    const vteacher = fetch(`http://localhost:4000/exec`).json();

    console.log(vteacher.result);

    return (
        <Left text={vteacher.toString()} />
    );
}