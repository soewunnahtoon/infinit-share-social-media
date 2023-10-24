import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "infinit-share-social-media.firebaseapp.com",
  projectId: "infinit-share-social-media",
  storageBucket: "infinit-share-social-media.appspot.com",
  messagingSenderId: "194419797890",
  appId: "1:194419797890:web:431567c9532acd3c91a99b",
};

const app = initializeApp(firebaseConfig);

export { app };
