// const { initializeApp, applicationDefault } = require("firebase-admin/app");
// // const { getAnalytics } = require("firebase/analytics");
// const { getDatabase } = require('firebase-admin/database');

// const firebaseConfig = {
// 	apiKey: "AIzaSyCf9eSoFlVoX2PHfITgMRcQ_dvvaxpezl8",
// 	authDomain: "arcadedb-bbd3e.firebaseapp.com",
//     credential: applicationDefault(),
// 	databaseURL:
// 		"https://arcadedb-bbd3e-default-rtdb.asia-southeast1.firebasedatabase.app",
// 	projectId: "arcadedb-bbd3e",
// 	storageBucket: "arcadedb-bbd3e.appspot.com",
// 	messagingSenderId: "1026129301614",
// 	appId: "1:1026129301614:web:aeaf5fd82ffbaa6058567f",
// 	measurementId: "G-B6YLMDMSYW"
// };

// const admin = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(admin);
// const database = getDatabase(admin);

// module.exports = {admin, database};

const admin = require('firebase-admin');

const serviceAccount = require('./arcadedb-bbd3e-firebase-adminsdk-7b6h6-7240e08039.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://arcadedb-bbd3e-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;
