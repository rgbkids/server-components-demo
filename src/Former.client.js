import {useState, useTransition} from 'react';
import {useLocation} from './LocationContext.client';
import {createFromReadableStream} from 'react-server-dom-webpack';
import {useRefresh} from './Cache.client';

export default function Former({id, initialTitle, initialBody, initialBuild, initialUrl}) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [build, setBuild] = useState(initialBuild);
    const [url, setUrl] = useState(initialUrl);
    const [deploy, setDeploy] = useState(false);

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
        setUrl(`http://vteacher.cmsvr.live:${body}/`);

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
        setDeploy(true);
    }

    async function handlePost() {

        const regex = new RegExp("^https://github.com(\/.+?\/)server-components-demo.git$");
        if (!regex.test(title.toString())) {
            alert("Error");
            return;
        }

        const url = `http://vteacher.cmsvr.live/post?title=${title}&body=${body}`;

        const result = await fetch(url)
            .then(response => response.json())
            .then(data => {
                return data;
            });

        setBody(result.web_port);

        const portWeb = result.web_port;
        const portDB = result.db_port;

        const buildText = `
version: "3.8"
services:
  postgres-${portDB}:
    image: postgres:13
    environment:
      POSTGRES_USER: notesadmin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: notesapi
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

            <p>STEP 1. Fork React Server Components Demo to your repository.</p>
            <a href={`https://github.com/reactjs/server-components-demo`} target={"_blank"}>https://github.com/reactjs/server-components-demo</a>
            <p>↓</p>

            <p>STEP 2. Save your repository url.</p>
            <p>(ex) https://github.com/your-id/server-components-demo.git</p>
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
                    Save
                </button>
            </p>

            <div hidden={body ? false : true}>
                <p>↓</p>

                <input
                    type="hidden"
                    value={body}
                />
                <p>STEP 3. Overwride this docker-compose.yml to your project.</p>
                <p>docker-compose.yml</p>
                <textarea
                    value={build}
                    readOnly={true}
                />

                <p>
                    <button
                        onClick={() => {
                            handleCreate();
                        }}>
                        Deploy
                    </button>
                </p>
            </div>

            <div hidden={url ? false : true}>
                <p>↓</p>

                <div hidden={deploy ? true : false}>
                    Deploying ...
                </div>

                <div hidden={deploy ? false : true}>
                    <p>URL</p>
                    <a href={url} target={"_blank"}>{url}</a>
                </div>
            </div>

        </form>
    );
}