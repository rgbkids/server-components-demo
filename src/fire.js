import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDS12gHH6QsdYV8ckt0SRA4tuu2feKU0Fc",
    projectId: "vteacher-online",
    authDomain: "vteacher-online.firebaseapp.com",
    databaseURL: "https://vteacher-online.firebaseio.com",
};

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

export function getDb() {
    return db;
}

const auth = firebase.auth();

export function getAuth() {
    return auth;
}

export const signIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};
