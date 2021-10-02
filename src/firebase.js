import firebase from 'firebase';

export const useSignIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};

export const useSignInPopup = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
};

export const useSignOut = () => {
    firebase.auth().signOut();
};

export const useCurrentUser = () => {
    return firebase.auth().currentUser;
};

export const useFirebase = () => {
    return firebase;
}

// TODO: 外部に出す
const firebaseConfig = {
    apiKey: "AIzaSyCdxET3c7jcdHd8YrUy1iN0VZumrvhWEws",
    projectId: "vteacher-studywithme",
    authDomain: "vteacher-studywithme.firebaseapp.com",
    databaseURL: "https://vteacher-studywithme.firebaseio.com",
};

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}
