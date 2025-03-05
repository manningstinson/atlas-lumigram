// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU5EMbnHyPEvmzQhqOpbMQSgU8FZqA60w",
  authDomain: "atlas-lumigram-75c41.firebaseapp.com",
  projectId: "atlas-lumigram-75c41",
  storageBucket: "atlas-lumigram-75c41.firebasestorage.app",
  messagingSenderId: "873728237723",
  appId: "1:873728237723:web:275b1dee64d0c968ea263e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;