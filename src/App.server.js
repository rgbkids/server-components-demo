import {Suspense} from 'react';

import Hello from './Hello.server';
import World from './World.server';
import Right from "./Right.client";
import Former from "./Former.server";

export default function App({selectedId}) {
    return (
        <div className="main">
            <span>v.0.8.1</span>

            <Hello selectedId={selectedId} />
            <Suspense fallback={<Right text={"This is suspense."} />}>
                <World selectedId={selectedId} />
            </Suspense>

            <section key={selectedId}>
                <Former selectedId={selectedId} />
            </section>
        </div>
    );
}