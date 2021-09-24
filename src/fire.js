import firebase from 'firebase';

export const useSignIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};

export const useFirebase = () => {
    return firebase;
}

const firebaseConfig = {
    apiKey: "AIzaSyDS12gHH6QsdYV8ckt0SRA4tuu2feKU0Fc",
    projectId: "vteacher-online",
    authDomain: "vteacher-online.firebaseapp.com",
    databaseURL: "https://vteacher-online.firebaseio.com",
};

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}

// const db = firebase.firestore();
// db.settings({
//     timestampsInSnapshots: true
// });
//
// const auth = firebase.auth();
