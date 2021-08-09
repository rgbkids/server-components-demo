# Introduction

![prof2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/6fade923-11c7-9d6c-caef-83f2858a9e15.png)"I was late for React"

![prof4.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/01846611-9b4b-57fe-4b54-bd32db407b2c.png)"I was doing Vue"

![prof3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/d91e7f32-31c0-51df-6cfc-8b5854886da2.png)「SSR ( PHP / Ruby on Rails ) ...」

I think it's good news for such people.

If you want to start React now, I `React Server Components` recommend.

A paradigm change has occurred, and in the last five years or so, SSR (Server Side Rendering: PHP, Ruby on Rails, etc.) has changed to SPA (Single Page Application: React, Vue, etc.).
In the future, we are moving to **the best of SPA and SSR** .

## Posted by this article

I wrote the following article 5 years ago (in the era of React v0.1). Thanks.
This time it's a sequel to this post.
As with the last time, the concept is "catch up a little earlier".


### Current version of React

In December 2020, Facebook released a demo of React Server Components.

The current version of React is 18, but the official introduction of React Server Components is expected to be 19 or later. So far, experimental features have been released that can be said to be a stepping stone for React Server Components. As the industry expects, if everything is for React Server Components, the conventional wisdom will change, so I think it's easier to accept without prejudice.

Why don't you try to make a little web application that is convenient for the team while analyzing the demo code issued by the React team?
DB uses PostgreSQL, but the goal is `React Server Components + Relay ＋ GraphQL` .


# Demonstration installation

See the README for how to install the demo. 
https://github.com/reactjs/server-components-demo

If you can confirm it on localhost, let's move on.
http://localhost:4000/

Using this demo as a skeleton, I will add my own components.


## Delete files other than necessary

It is okay to delete the rest of the files, leaving the following below src.

- App.server.js
- Root.client.js
- Cache.client.js
- db.server.js              
- LocationContext.client.js
- index.client.js


## Preparation / review

How to write React. For those who are new to us and those who haven't seen it in a long time. Here is the basic syntax.

```react
export default function Hoge() {
    return (
        <div>
            This is Hoge.
        </div>
    );
}
```

By defining this with the file name Hoge, `<Hoge />` you can tag it as follows. `<Hoge />` The content is the HTML described in return, which is displayed when viewed from a web browser. This technology is called JSX and is developed by Facebook. Other components can be described in return.


# How to add your own components

## Types of React Sever Components

React Sever Components is a popular name. Three types of files are used for use.

- **Server component**
  - File name naming convention is .server.js
  - Render on the server side
  - Access to other resources (react-fetch to REST API, react-pg to DB reference, Relay + GraphQL, etc.)
- **Client component**
  - File name naming convention is .client.js
  - Render on the client side
  - Access to other resources (from react-fetch to REST API, etc.)
  - You can use state just like a regular React component.
- **Common components**
  - File name naming convention is .js
  - A component that can be used on both the server and client sides. overhead processing.


### Naming (naming convention)

When I thought about a component called ToDO, I ended up with the following file structure.

- ToDo.server.js
- ToDo.client.js
- ToDo.js

However, this is not recommended as the default name will be duplicated when importing (in this case you can set the name at ToDo .import). The Facebook demo doesn't have this structure either.
Design your components properly and divide them by component.

If the client component performs a process that only the server component is allowed to do, an error will occur.

Example: When using db (react-pg) in the client component, `TypeError: Cannot read property 'db' of undefined` it will be at runtime.

```react
import {db} from './db.server'
(略)
const notes = db.query(
    `select * from notes where title ilike $1`,['%%']
).rows;
```

**At first, it's easier to make everything a server component.**
**Change what the client component can do.**


## Fix App.server.js

React Server Components starts here. Describe the server component in this file.

For now, let's do this for now.

```src/App.server.js
export default function App({selectedId, isEditing, searchText}) {
  return (
    <div>
    </div>
  );
}
```


## Creating a component

Let's add our own components.


### First prepare the server component

First, let's prepare the server component. As I mentioned earlier, let's start with everything as a server component and then look for what can be a client component.

`Hoge.server.js` Create directly under the src directory and copy the code below (because it is a server component, it will follow the rules `server.js` ).

- src/Hoge.server.js (create new)

```src/Hoge.server.js
export default function Hoge() {
    return (
        <div>
            This is Hoge.server.js!
        </div>
    );
}
```

Write this Hoge (Hoge.server.js) in App.server.js.

- src/App.server.js (Since it already exists, change it and save it)

```src/App.server.js
import Hoge from './Hoge.server';

export default function App({selectedId, isEditing, searchText}) {
  return (
    <div className="main">
        <Hoge />
    </div>
  );
}
```

Server components are rendered on the server side. At the moment it is no different from regular SSR (PHP or Ruby on Rails) (we will create client components later).


### Access to other resources

Server components can access db (react-pg) (although direct access to db is not recommended for app design).
You can use fetch (react-fetch) to use REST API. fetch can also be used from the client component, but you can reduce the amount of data returned to the client by processing it with the server component where it seems to be heavy processing (react Server Components target bundle size zero).

Let's change Hoge.server.js as follows.
If you check it with a web browser, the value obtained by db / fetch will be displayed.

- src / Hoge.server.js (let's change it)

```src/Hoge.server.js
import {db} from './db.server'; // db（react-pg）
import {fetch} from 'react-fetch'; // fetch（react-fetch）

export default function Hoge() {
    // db
    const notes = db.query(
        `select id from notes`
    ).rows;

    // fetch
    const note = fetch(`http://localhost:4000/notes/1`).json();
    let {id, title, body, updated_at} = note;

    return (
        <div>
            <p>db:</p>
            <ul>
                {notes.map((note) => (
                    <li>{note.id}</li>
                ))}
            </ul>
            <p>fetch:</p>
            {id}{title}{body}{updated_at}
        </div>
    );
}
```

![prof1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/6c0b4ace-ba61-d2f2-0576-882b3a9b0063.png)**"experiment"**

Let's copy Hoge.server.js and create Hoge.client.js.
Let's import App.server.js to Hoge.client. It will be
at run time `TypeError: Cannot read property 'db' of undefined` .
(Fetch is possible)
Let's restore it after the experiment (return the import of App.server.js to Hoge.server).


## Describe server and client components

Let's write the server component and the client component in a nested manner. React Server Components, in principle, start with server components.
Let's design the following components.

```
- ServerComponentHello (Hello.server.js)
    ∟ ClientComponentLeft (Left.client.js)
- ServerComponentWorld (World.server.js)
    ∟ ClientComponentRight (Right.client.js)
```

- src / App.server.js (let's change it)

```src/App.server.js
import Hello from './Hello.server';
import World from './World.server';

export default function App({selectedId, isEditing, searchText}) {
  return (
    <div className="main">
        <Hello />
        <World />
    </div>
  );
}
```

- src / Hello.server.js (Create new)  
Server component. Get the value from db and pass it on to the child client component (Left).

```src/Hello.server.js
import {db} from './db.server';
import Left from './Left.client';

export default function Hello() {
    const notes = db.query(
        `select id from notes`
    ).rows;

    let text = "";
    notes.map((note) => {
        text += `${note.id},`;
    });

    return (
        <Left text={text} />
    );
}
```

- src / World.server.js (Create new)
Server component. The value is fetched by fetch and inherited by the child client component (Right).

```src/World.server.js
import {fetch} from 'react-fetch';
import Right from './Right.client';

export default function World() {
    const note = fetch(`http://localhost:4000/notes/1`).json();
    let {id, title, body, updated_at} = note;
    let text = `${id}${title}${body}${updated_at}`;

    return (
        <Right text={text} />
    );
}
```

- src / Left.client.js (Create new)  
Client component. Display the passed value on the left (set with css).

```src/Left.client.js
export default function Left({text}) {
    return (
        <div className="left">
            {text}
        </div>
    );
}
```

- src / Right.client.js (Create new)  
Client component. Display the passed value on the right side (set with css).

```src/Right.client.js
export default function Right({text}) {
    return (
        <div className="right">
            {text}
        </div>
    );
}
```

- public / style.css (change existing file. * Added at the end)

```public/style.css
.left {
  float: left;
  width: 50%;
}

.right {
  float: right;
  width: 50%;
}
```

Let's check from a web browser.
http://localhost:4000/


You should see something like the following.

```
1,2 ...                1Meeting ...
```


![prof1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/6c0b4ace-ba61-d2f2-0576-882b3a9b0063.png)**"Supplement"**
By the way, if you put ServerComponent which is a child of ClientComponent, no error will occur, but you cannot access db from that ServerComponent (fetch is possible).

```
- ServerComponentHello (Hello.server.js)
    ∟ ClientComponentLeft (Left.client.js)
        ∟ ServerComponentWorld (World.server.js) ※You cannot access db.
    ∟ ClientComponentRight (Right.client.js)
```


# Benefits of React Server Components

Good points of SSR and SPA.
React Server Components benefit from "improved rendering performance (target bundle size zero)".
(React Server Components do not make the display lighter, but component design needs to be done properly, such as the WarterFall problem in SPA).


![prof1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/6c0b4ace-ba61-d2f2-0576-882b3a9b0063.png)**"Experiment"**
**Let's intentionally create a delay.**

The React Server Components demo provides sleep for fetching.
Doing this intentionally creates a delay.

- src/World.server.js (let's change)

```src/World.server.js
import {fetch} from 'react-fetch';
import Right from './Right.client';

export default function World() {
    let _ = fetch(`http://localhost:4000/sleep/3000`); // Sleep 3 seconds
    
    const note = fetch(`http://localhost:4000/notes/1`).json();
    let {id, title, body, updated_at} = note;
    let text = `${id}${title}${body}${updated_at}`;

    return (
        <Right text={text} />
    );
}
```

Let's check it with a web browser.
**I think it will be displayed after 3 seconds.**
http://localhost:4000/

![prof1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/62638/6c0b4ace-ba61-d2f2-0576-882b3a9b0063.png)**"Verification"**
Using Chrome as a web browser, open Chrome's development tools (right-click to verify), select the Network tab, `react?location=...` and look at the Preview to see the data returned from the server side to the client side. increase.


## TIPS (collection of numerous experimental functions)

It is said that the experimental functions so far have been prepared for React Server Components. These experimental features are used in the demo. I will introduce this as TIPS.


### TIPS1: Suspense

Suspense is an experimental feature introduced in React 16.
You can "wait" for code to load and declaratively specify a loading state (like a spinner).
https://ja.reactjs.org/docs/concurrent-mode-suspense.html

Follow the demo `<Suspense />` and use.

- reference
https://github.com/reactwg/react-18/discussions/37


- src / App.server.js (let's change it)

```src/App.server.js
import {Suspense} from 'react';

import Hello from './Hello.server';
import World from './World.server';
import Right from "./Right.client";

export default function App({selectedId, isEditing, searchText}) {
    return (
        <div className="main">
            <Hello />
            <Suspense fallback={<Right text={"This is suspense."} />}>
                <World />
            </Suspense>
        </div>
    );
}
```

Let's check it with a web browser.
This time, `This is suspense.` I think you'll see the first, and after 3 seconds you'll see the full page.
http://localhost:4000/


### TIPS2: Transition

When the screen is displayed suddenly, such as when you press a button, you may want to adjust the timing of screen update, such as when the white screen glances for a moment or when you can no longer see the information that was displayed before. I have.
You can skip these "what you don't want to see" and allow them to wait for new content to load before transitioning to a new screen.

- reference  
https://ja.reactjs.org/docs/concurrent-mode-patterns.html

It is obvious when you actually try it.
Let's add the redrawing process. Prepare a pattern that uses transitions and a pattern that does not, and compare them.

- src / Left.client.js (let's change it)

```src/Left.client.js
import {useTransition} from 'react';
import {useLocation} from './LocationContext.client';

export default function Left({text}) {
    const [location, setLocation] = useLocation();
    const [, startTransition] = useTransition();

    let idNext = location.selectedId + 1;

    return (
        <div className="left">
            <p>id={location.selectedId}</p>
            <button
                onClick={() => {
                    setLocation((loc) => ({
                        selectedId: idNext,
                        isEditing: false,
                        searchText: loc.searchText,
                    }));
                }}>
                Next id={idNext}
            </button>
            <button
                onClick={() => {
                    startTransition(() => {
                        setLocation((loc) => ({
                            selectedId: idNext,
                            isEditing: false,
                            searchText: loc.searchText,
                        }));
                    });
                }}>
                Next id={idNext} (Transition)
            </button>
            <p>{text}</p>
        </div>
    );
}
```

I think that using transitions will result in a more natural screen transition.
Without transitions, the Right component would display "This is suspense." Every time you press the Next button.
The Right component intentionally puts in a 3 second delay process, so regardless of the use of transitions, it will wait 3 seconds for new data to be displayed.


## Pass values ​​from client component to server component

This is a method of inheriting the value on the server side.
In the Facebook demo, the app takes three arguments ( `{selectedId, isEditing, searchText}` ).
This is related to the client component code for the transition above (the setLocation function in LocationContext.client).

```src/Left.client.js
        setLocation((loc) => ({
            selectedId: idNext,
            isEditing: false,
            searchText: loc.searchText,
        }));
```

This allows you to pass values ​​from the client to the server.

The server component `<Hello />` and `<World />` , let's take over the selectedId. `selectedId={selectedId}` It is described as.

- src / App.server.js (change)

```src/App.server.js
import {Suspense} from 'react';

import Hello from './Hello.server';
import World from './World.server';
import Right from "./Right.client";

export default function App({selectedId, isEditing, searchText}) {
    return (
        <div className="main">
            <Hello selectedId={selectedId} />
            <Suspense fallback={<Right text={"This is suspense."} />}>
                <World selectedId={selectedId} />
            </Suspense>
        </div>
    );
}
```


`<Hello />` and `<World />` selectedId to change so that can also be referred to. Now that you can refer to the selectedId, let's use it for fetch / db.

- src / Hello.server.js (change)

```src/Hello.server.js
import {db} from './db.server';
import Left from './Left.client';

export default function Hello({selectedId}) {
    const notes = db.query(
        `select id from notes where id=$1`, [selectedId]
    ).rows;

    let text = selectedId;
    notes.map((note) => {
        text = note.id;
    });

    return (
        <Left text={text} />
    );
}
```


- src / World.server.js (change)

```src/World.server.js
import {fetch} from 'react-fetch';
import Right from './Right.client';

export default function World({selectedId}) {
    let _ = fetch(`http://localhost:4000/sleep/3000`); // Sleep 3 seconds

    if (!selectedId) {
        return (
            <Right />
        );
    }

    let note = fetch(`http://localhost:4000/notes/${selectedId}`).json();
    let {title, body, updated_at} = note;
    let text = `${selectedId}${title}${body}${updated_at}`;

    return (
        <Right text={text} />
    );
}
```

Let's check it with a web browser.
When you press Next, the data according to the id will be displayed.
http://localhost:4000/

**Note: If you leave it as it is, if you specify an id that does not exist, a syntax error will occur and it will drop, so please correct the API of the demo (provisional support).**

- server / api.server.js (and change)  
177 line, `res.json(rows[0]);` change `res.json(rows[0] || "null");` .

```server/api.server.js
app.get(
  '/notes/:id',
    ...
    res.json(rows[0] || "null");
    ...
);
```

- `"null"` Please see here for the reason for choosing.  

https://www.rfc-editor.org/rfc/rfc8259

https://stackoverflow.com/questions/9158665/json-parse-fails-in-google-chrome

- Pull Request to `reactjs/server-components-demo`  

https://github.com/reactjs/server-components-demo/pull/50


## REST API processing by fetch

Let's register the record in PostgreSQL.
Use the API provided in the demo ( `server/api.server.js` implemented in).
`server/api.server.js` In addition to registration, there is also an API for updating / deleting.

Let's implement the registration process by referring to the demo code.

New registration (id is newly given). Press the Next button to check the newly created data. It is added at the very end.
It's okay to put a transition in onClick.


- src / Former.server.js (create new)

```src/Former.server.js
import {fetch} from 'react-fetch';
import FormerClient from './Former.client';

export default function Former({selectedId}) {
    const note =
        selectedId != null
            ? fetch(`http://localhost:4000/notes/${selectedId}`).json()
            : null;

    if (!note) {
        return <FormerClient id={null} initialTitle={""} initialBody={""} />;
    }

    let {id, title, body} = note;

    return <FormerClient id={id} initialTitle={title} initialBody={body} />;

}
```


- src / Former.client.js (create new)

```src/Former.client.js
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
            selectedId: "",
            isEditing: false,
            searchText: location.searchText,
        };
        const endpoint = `http://localhost:4000/notes/`;
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

    async function handleUpdate() {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: location.selectedId,
            isEditing: false,
            searchText: location.searchText,
        };
        const endpoint = `http://localhost:4000/notes/${location.selectedId}`;
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

    async function handleDelete() {
        const payload = {title, body};
        const requestedLocation = {
            selectedId: location.selectedId,
            isEditing: false,
            searchText: location.searchText,
        };
        const endpoint = `http://localhost:4000/notes/${location.selectedId}`;
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
```


- src / App.server.js (change)  
Describe the created Former (server component).

`<Former />` Give a key to the parent element of. The key is needed for React to identify which elements have been changed / added / deleted.
In the following `<section></section>` we used it, `<div></div>` but okay.

```src/App.server.js
import {Suspense} from 'react';

import Hello from './Hello.server';
import World from './World.server';
import Right from "./Right.client";
import Former from "./Former.server";

export default function App({selectedId, isEditing, searchText}) {
    return (
        <div className="main">
            <Hello selectedId={selectedId} />
            <Suspense fallback={<Right text={"This is suspense."} />}>
                <World selectedId={selectedId} />
            </Suspense>

            <section key={selectedId}>
                <Former selectedId={selectedId} isEditing={isEditing} />
            </section>
        </div>
    );
}
```


# to be continued

What did you think?
I was able to create an original component and register / update / delete data.
I also experienced the experimental features that are said to be for React Server Components, as described in TIPS.
Next time, I will explain Relay + GraphQL in the server component.
