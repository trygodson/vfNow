// // Firebase Cloud Messaging Configuration File.
// // Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// var firebaseConfig = {
//   apiKey: 'AIzaSyALKpD7wcZ0Hs90DVGu_35-0Dyx2MInt6I',
//   authDomain: 'vf-mobile-d1e80.firebaseapp.com',
//   projectId: 'vf-mobile-d1e80',
//   storageBucket: 'vf-mobile-d1e80.appspot.com',
//   messagingSenderId: '337918351389',
//   appId: '1:337918351389:web:64d6ac8768547b77210ef4',
//   measurementId: 'G-79221XEQ9E',
// };

// const app = initializeApp(firebaseConfig);

// export const messaging = getMessaging();

// export const requestForToken = () => {
//   Notification.requestPermission()
//     .then((permission) => {
//       if (permission === 'granted') {
//         return getToken(messaging, {
//           vapidKey: `BMMro7WmSBc89SIDwUb0eijWCfG1osCnHgOfldaAQ5YdGUHRJsZo-6y4rbxjEUVvnfPzCMDhJgeIK8lHHwDL484`,
//         })
//           .then((currentToken) => {
//             if (currentToken) {
//               console.log('current token for client: ', currentToken);
//               return currentToken;
//               // Perform any other neccessary action with the token
//             } else {
//               // Show permission request UI
//               console.log('No registration token available. Request permission to generate one.');
//             }
//           })
//           .catch((err) => {
//             console.log('An error occurred while retrieving token. ', err);
//           });
//       }
//     })
//     .catch((err) => {
//       console.log('The NOtification Permission Given');
//     });
// };

// export function requestPermission() {
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       const app = initializeApp(firebaseConfig);
//       const messaging = getMessaging(app);
//       getToken(messaging, {
//         vapidKey: 'BMMro7WmSBc89SIDwUb0eijWCfG1osCnHgOfldaAQ5YdGUHRJsZo-6y4rbxjEUVvnfPzCMDhJgeIK8lHHwDL484',
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log('currentToken: ', currentToken);
//         } else {
//           console.log('Can not get token');
//         }
//       });
//     } else {
//       console.log('Do not have permission!');
//     }
//   });
// }

// // Handle incoming messages. Called when:
// // - a message is received while the app has focus
// // - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
