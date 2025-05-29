
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzXeOtgHHU5wCndbd5bp6CtN8z_ROHy7Y",
  authDomain: "appstudy-8700b.firebaseapp.com",
  projectId: "appstudy-8700b",
  storageBucket: "appstudy-8700b.firebasestorage.app",
  messagingSenderId: "400117595966",
  appId: "1:400117595966:web:b8fb237f4fdb8a1656b66f",
  measurementId: "G-FT4SZ85WSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dbfirestore = getFirestore(app);

export { dbfirestore }