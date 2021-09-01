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

    async function handleRegister() {

        const regex = new RegExp("^https://github.com(\/.+?\/)server-components-demo.git$");
        if (!regex.test(title.toString())) {
            alert("Error");
            return;
        }

        const url = `http://vteacher.cmsvr.live/register?title=${title}&body=${body}`;

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

    async function handleDeploy() {
        setUrl(`http://vteacher.cmsvr.live:${body}/`);

        const payload = {title, body};
        const requestedLocation = {
            selectedId: ""
        };
        const endpoint = `http://vteacher.cmsvr.live/deploy`;
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

    function handleBuild() {
        const target = document.getElementById("#build");
        target.select();
        document.execCommand("copy");
        alert("Copy completed.");
    }

    return (
        <>
            <div className={"application"}>
                <p>VTEACHER</p>
                <strong>Serverless for React Server Components</strong>
            </div>

            <form className={"note-editor-form"} onSubmit={(e) => e.preventDefault()}>

                <p className={"sidebar-note-header"}>
                    STEP 1. Fork this repository.
                </p>
                <a href={`https://github.com/reactjs/server-components-demo`} target={"_blank"}>
                    https://github.com/reactjs/server-components-demo
                </a>

                <p className={"arrow"}>👇</p>

                <p>STEP 2. Register your `Git Clone URL`.</p>
                <input
                    type="text"
                    placeholder={"ex) https://github.com/YOUR-ID/server-components-demo.git"}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <button
                    className={"edit-button edit-button--solid"}
                    onClick={() => {
                        handleRegister();
                    }}>
                    Register
                </button>

                <div hidden={body ? false : true}>
                    <p className={"arrow"}>👇</p>

                    <input
                        type="hidden"
                        value={body}
                    />

                    <p>STEP 3. Overwrite this docker-compose.yml to your project.</p>
                    <small>docker-compose.yml</small>
                    <textarea
                        id={"#build"}
                        value={build}
                        readOnly={true}
                        onClick={() => {
                            handleBuild();
                        }}
                    />

                    <button
                        className={"edit-button edit-button--solid"}
                        onClick={() => {
                            handleDeploy();
                        }}>
                        Deploy
                    </button>
                </div>

                <div hidden={url ? false : true}>
                    <p className={"arrow"}>👇</p>

                    <div hidden={deploy ? true : false}>
                        Deploying ...
                    </div>

                    <div hidden={deploy ? false : true}>
                        <p>URL</p>
                        <a href={url} target={"_blank"}>{url}</a>
                    </div>
                </div>

            </form>
        </>
    );
}