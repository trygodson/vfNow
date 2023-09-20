// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// var firebaseConfig = {
//   apiKey: "AIzaSyDYPAXV6z60k-_7C6REAzIJF5esKraM8iw",
//   authDomain: "vote-and-fun-98af0.firebaseapp.com",
//   projectId: "vote-and-fun-98af0",
//   storageBucket: "vote-and-fun-98af0.appspot.com",
//   messagingSenderId: "811161071036",
//   appId: "1:811161071036:web:23378612b8f08fa9284fb9",
//   measurementId: "G-BEP6SLTNXN",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// export const getTokenn = (setTokenFound) => {
//   return getToken(messaging, {
//     vapidKey:
//       "BCTQUgXc6AHqc17xopC-cd2KsfMsi4p3v5Im9Hoov0ud3Getp9r1n1wBfhIQOGqJJqBDDN_6cpXSe7uCV6N-P-U",
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log("current token for client: ", currentToken);
//         setTokenFound(true);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//         requestPermission();
//         setTokenFound(false);
//         // shows on the UI that permission is required
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//       // catch error while creating client token
//     });
// };

// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//     } else console.log("NOttttt  Notification permission granted.");
//   });
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
