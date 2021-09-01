import FormerClient from './Former.client';

export default function Former({selectedId}) {
    return <FormerClient id={selectedId} initialTitle={""} initialBody={""} initialUrl={""} />;
}