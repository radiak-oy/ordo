import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import createApi from './api';

try {
  const firebaseConfig = {
    apiKey: 'AIzaSyA6gfVJNvHaYDlwUwku7fH0iLjATam8NVQ',
    authDomain: 'ordo-390008.firebaseapp.com',
    projectId: 'ordo-390008',
    storageBucket: 'ordo-390008.appspot.com',
    messagingSenderId: '591214992994',
    appId: '1:591214992994:web:5611f6bd8cbee7763cbb3b',
  } as FirebaseOptions;

  const firebaseApp = initializeApp(firebaseConfig);

  const vapidKey =
    'BOQ4d8OwjchGg3PvUNxe2RkIuVuy7kgDXROLTOFobQD65KXxBElvKiQ-4zp3w4nKCiELB19XxpyqPU0J6yyvXSc';

  const messaging = getMessaging(firebaseApp);

  const token = await getToken(messaging, {
    vapidKey,
  });

  console.log(`FCM Token: ${token}`);

  const { subscribeToTopic } = createApi();

  const result = await subscribeToTopic('gigs', token);
  if (!result.ok) {
    console.error(result.errorMessage);
  } else {
    console.log('Subscribed to notifications.');
  }

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
  });
} catch (error) {
  console.error(error);
}
