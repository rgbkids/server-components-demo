//@ts-check

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

if (firebase.apps.length == 0) {
    const firebase_config = require(__dirname + '/../settings');
    const firebaseConfig = firebase_config["firebase_config"];

    firebase.initializeApp(firebaseConfig);
}
