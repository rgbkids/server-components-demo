import Former from "./Former.server";

export default function App({selectedId}) {
    return (
        <div className="main">
            <section key={selectedId}>
                <Former selectedId={selectedId} />
            </section>
        </div>
    );
}