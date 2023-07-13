importScripts(
  'https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyA6gfVJNvHaYDlwUwku7fH0iLjATam8NVQ',
  authDomain: 'ordo-390008.firebaseapp.com',
  projectId: 'ordo-390008',
  storageBucket: 'ordo-390008.appspot.com',
  messagingSenderId: '591214992994',
  appId: '1:591214992994:web:5611f6bd8cbee7763cbb3b',
});

const messaging = firebase.messaging();
