// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBytes,
} from "firebase/storage";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQDB0FB_tgj66ss9vPhV3qHTD_vuXoLB4",
    authDomain: "treelink-react.firebaseapp.com",
    projectId: "treelink-react",
    storageBucket: "treelink-react.appspot.com",
    messagingSenderId:"991647359898",
    appId: "1:991647359898:web:9aef2d5d70ea5fe93fd023",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export async function userExist(uid) {
    const docRef = doc(db, "users", uid);
    const res = await getDoc(docRef);
    //console.log(res);
    return res.exists();
}

export async function existsUsername(username) {
    const users = [];
    const docsRef = collection(db, "users");
    const q = query(docsRef, where("username", "==", username));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });

    return users.length > 0 ? users[0].uid : null;
}

export async function registerNewUser(user) {
    try {
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, user.uid);

        await setDoc(docRef, user);
    } catch (error) {
        console.error(error);
    }
}

export async function updateUser(user) {
    try {
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, user.uid);
        await setDoc(docRef, user);
    } catch (error) {
        console.error(error);
    }
}

export async function getUserInfo(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const document = await getDoc(docRef);

        return document.data();
    } catch (error) {
        console.error(error);
    }
}

export async function insertNewLink(link) {
    try {
        const docRef = collection(db, "links");
        const res = await addDoc(docRef, link);
        return res;
    } catch (error) {
        console.error(error);
    }
}

export async function getLinks(uid) {
    const links = [];
    try {
        const collectionRef = collection(db, "links");
        const q = query(collectionRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const link = { ...doc.data() };
            link.docId = doc.id;
            links.push(link);
        });

        return links;
    } catch (error) {
        console.error(error);
    }
}

export async function updateLink(docId, link) {
    try {
        const docRef = doc(db, "links", docId);
        const res = await setDoc(docRef, link);
        return res;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteLink(docId) {
    try {
        const docRef = doc(db, "links", docId);
        const res = await deleteDoc(docRef);

        return res;
    } catch (error) {
        console.error(error);
    }
}

export async function setUserProfilePhoto(uid, file) {
    try {
        const imageRef = ref(storage, `images/${uid}`);
        const resUpload = await uploadBytes(imageRef, file);
        return resUpload;
    } catch (error) {
        console.error(error);
    }
}

export async function getProfilePhotoUrl(profilePicture) {
    try {
        const imageRef = ref(storage, profilePicture);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error(error);
    }
}

export async function getUserPublicProfileInfo(uid) {
    const profileInfo = await getUserInfo(uid);
    const linksInfo = await getLinks(uid);
    return {
        profileInfo: profileInfo,
        linksInfo: linksInfo,
    };
}

export async function logout() {
    await auth.signOut();
}