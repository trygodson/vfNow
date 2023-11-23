// import { initializeApp } from 'firebase/app';
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
// import { getToken, onMessage } from 'firebase/messaging';
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
// const messaging = getMessaging(app);

// function requestPermission() {
//   console.log('Requesting permission...');
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       getToken(messaging, {
//         vapidKey: `BMMro7WmSBc89SIDwUb0eijWCfG1osCnHgOfldaAQ5YdGUHRJsZo-6y4rbxjEUVvnfPzCMDhJgeIK8lHHwDL484`,
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log('currentToken: ', currentToken);
//           onMessage(messaging, (payload) => {
//             console.log(payload, 'notification');
//           });
//         } else {
//           console.log('Can not get token');
//         }
//       });
//     } else {
//       console.log('Do not have permission!');
//     }
//   });
// }

// // onBackgroundMessage(messaging, (payload) => {
// //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
// //   // Customize notification here
// //   const notificationTitle = 'Background Message Title';
// //   const notificationOptions = {
// //     body: 'Background Message body.',
// //     icon: '/firebase-logo.png',
// //   };

// //   self.registration.showNotification(notificationTitle, notificationOptions);
// // });

// requestPermission();
