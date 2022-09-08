// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOnoAicIzMCeUd0alixeV3ruc_NJ-Gicw",
  authDomain: "todo-346b6.firebaseapp.com",
  projectId: "todo-346b6",
  storageBucket: "todo-346b6.appspot.com",
  messagingSenderId: "1060653151293",
  appId: "1:1060653151293:web:c84a35136f89216cb42654",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();