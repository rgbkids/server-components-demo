import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

export default function Former({id, initialTitle, initialBody, initialBuild}) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [build, setBuild] = useState(initialBuild);

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

    async function handlePost() {
        const url = `http://vteacher.cmsvr.live/post?title=${title}&body=${body}`;

        const result = await fetch(url)
            .then(response => response.json())
            .then(data => {
                return data;
            });

        console.log(result.port);
        setBody(result.port);

        setBuild(result.port);
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>

            <p>(1) React Server Components の雛形をあなたのリポジトリにコピー（fork）します。</p>
            <p>雛形</p>
            <p>https://github.com/rgbkids/server-components-demo.git</p>
            <p></p>


            <p></p>
            <p>(2) あなたのリポジトリのURLを入力してください。</p>
            <p>Git repository url:</p>
            <p>(ex) https://github.com/rgbkids/server-components-demo.git -b feature/vteacher-rsc-serverless</p>
            <input
                type="text"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />

            <p>
                <button
                    onClick={() => {
                        handlePost();
                    }}>
                    Post
                </button>
            </p>


            <p>※POST後に決定します。</p>
            <p>Your port:</p>
            <input
                type="text"
                value={body}
                onChange={(e) => {
                    setBody(e.target.value);
                }}
            />
            <p></p>

            <p>※POST後に決定します。</p>
            <p>あなたのビルド用のdocker-compose.yml ※コピーしてあなたのリポジトリのdocker-compose.ymlに保存してください。</p>
            <textarea readOnly={true}>
                {build}
            </textarea>

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