import firebase from 'firebase';

export const useSignIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithRedirect(provider);
    firebase.auth().signInWithRedirect(provider).then(result => {
    });
    // firebase.auth().signInWithPopup(provider).then(result => {
    // });
};

// export const useSignOut = () => {
//     // firebase.auth().signOut().then(result => {
//     // });
//     firebase.auth().signOut().then(result => {
//     });
// };

export const useSignOut = (result) => {
    // firebase.auth().signOut().then(result => {
    // });
    firebase.auth().signOut().then(result);
};

export const useCurrentUser = () => {
    return firebase.auth().currentUser;
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
