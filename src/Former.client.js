import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

const PORT = 80;//location.port;

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

    // 登録処理
    async function handleCreate() {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: ""
        };
        const endpoint = `http://vteacher.cmsvr.live:${PORT}/vteachers/`;
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

    // 更新処理
    async function handleUpdate() {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: location.selectedId
        };
        const endpoint = `http://vteacher.cmsvr.live:${PORT}/vteachers/${location.selectedId}`;
        const method = `PUT`;
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

    // 削除処理
    async function handleDelete() {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: location.selectedId
        };
        const endpoint = `http://vteacher.cmsvr.live:${PORT}/vteachers/${location.selectedId}`;
        const method = `DELETE`;
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
            <input
                type="text"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <input
                type="text"
                value={body}
                onChange={(e) => {
                    setBody(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    handleCreate();
                }}>
                Create
            </button>
            <button
                onClick={() => {
                    handleUpdate();
                }}>
                Update id={location.selectedId}
            </button>
            <button
                onClick={() => {
                    handleDelete();
                }}>
                Delete id={location.selectedId}
            </button>
        </form>
    );
}