import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

export default function Former({id, initialTitle, initialBody}) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);

    const [location, setLocation] = useLocation();
    const [, startNavigating] = useTransition();
    const refresh = useRefresh();

    function navigate(response) {
        const cacheKey = response.headers.get('X-Location');
        const nextLocation = JSON.parse(cacheKey);
        const seededResponse = createFromReadableStream(response.body);
        startNavigating(() => {
            refresh(cacheKey, seededResponse);
            setLocation(nextLocation);
        });
    }

    async function handleCreate() {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: ""
        };
        const endpoint = `http://vteacher.cmsvr.live/exec`;
        const method = `POST`;
        const response = await fetch(
            `${endpoint}?location=${encodeURIComponent(JSON.stringify(requestedLocation))}`,
            {
                method,
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response);
        navigate(response);
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <p>Git repository url:</p>
            <p>(ex) https://github.com/rgbkids/server-components-demo.git -b feature/vteacher-rsc-serverless</p>
            <input
                type="text"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <p>Your port:</p>
            <p>(ex) 4001</p>
            <input
                type="text"
                value={body}
                onChange={(e) => {
                    setBody(e.target.value);
                }}
            />
            <p>
                <button
                    onClick={() => {
                        handleCreate();
                    }}>
                    Deploy
                </button>
            </p>
        </form>
    );
}