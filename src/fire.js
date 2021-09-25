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

const firebaseConfig = {
    apiKey: "AIzaSyDS12gHH6QsdYV8ckt0SRA4tuu2feKU0Fc",
    projectId: "vteacher-online",
    authDomain: "vteacher-online.firebaseapp.com",
    databaseURL: "https://vteacher-online.firebaseio.com",
};

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}
