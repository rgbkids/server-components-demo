import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

export default function Former({id, initialTitle, initialBody, initialBuild, initialUrl}) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [build, setBuild] = useState(initialBuild);
    const [url, setUrl] = useState(initialBuild);

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

        setUrl(`http://vteacher.cmsvr.live:${body}/`);

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

        // console.log(result.port);
        setBody(result.web_port);

        const portWeb = result.web_port;
        const portDB = result.db_port;

        const buildText = `
version: "3.8"
services:
  postgres-${portDB}:
    image: postgres:13
    environment:
      POSTGRES_USER: vteachersadmin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: vteachersapi
    ports:
      - '${portDB}:5432'
    volumes:
      - ./scripts/init_db.sh:/docker-entrypoint-initdb.d/init_db.sh
      - db-${portDB}:/var/lib/postgresql/data

  vteachers-app-${portWeb}:
    build:
      context: .
    depends_on:
      - postgres-${portDB}
    ports:
      - '${portWeb}:4000'
    environment:
      DB_HOST: postgres-${portDB}
      PORT: 4000
      HOST: localhost
    volumes:
      - ./vteachers:/opt/vteachers-app/vteachers
      - ./public:/opt/vteachers-app/public
      - ./scripts:/opt/vteachers-app/scripts
      - ./server:/opt/vteachers-app/server
      - ./src:/opt/vteachers-app/src
      - ./credentials.js:/opt/vteachers-app/credentials.js

volumes:
  db-${portDB}:
`;

        setBuild(buildText);
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>

            <p>(1) React Server Components の雛形をあなたのリポジトリにコピー（fork）します。</p>
            <a href={`https://github.com/rgbkids/server-components-demo.git`}>GitHub</a>
            <p></p>

            <p></p>
            <p>(2) あなたのリポジトリのURLを入力してください。</p>
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
            <input
                type="hidden"
                value={body}
            />
            <p>docker-compose.yml ※コピーしてあなたのリポジトリのdocker-compose.ymlに上書きしてください。</p>
            <textarea
                value={build}
            />

            <p>
                <button
                    onClick={() => {
                        handleCreate();
                    }}>
                    Deploy
                </button>
            </p>

            <p>URL: ※Deploy後に決定します。</p>
            <input
                type="text"
                value={url}
            />
        </form>
    );
}