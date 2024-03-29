import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: "espresso-4efa0.firebaseapp.com",
  projectId: "espresso-4efa0",
  storageBucket: "espresso-4efa0.appspot.com",
  messagingSenderId: "1023619667111",
  appId: "1:1023619667111:web:f1e81b8705070809c3f782",
  databaseURL: "https://espresso-4efa0.firebaseio.com",
  measurementId: "G-BSVK8J96WE",
};

let app;

export const getFirestoreDb = async () => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  }

  return await getFirestore(app!);
};
