import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, child, update } from 'firebase/database';
import { User } from 'src/user/user.interface';

export class FirebaseService {
  // See: https://firebase.google.com/docs/web/learn-more#config-object
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };

  // Initialize Firebase
  app = initializeApp(this.firebaseConfig);
  db = getDatabase(this.app);

  writeUserData(user: User) {
    // Initialize Realtime Database and get a reference to the service
    try {
      // 如果使用者沒有key 就新增一個key
      const newUserKey = this.getOrGenerateUserKey(user);
      // A user entry.
      const userData = {
        username: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        lineId: user.customLineId || '',
      };
      const updates = {};
      updates['/users/' + newUserKey] = userData;
      return update(ref(this.db), updates);
    } catch (e) {
      //另外處理firebase的錯誤 避免被使用者直接看到
      throw new Error('系統新增錯誤，請稍後再試');
    }
  }
  getOrGenerateUserKey(user: User) {
    // 如果使用者沒有key 就新增一個key
    if (!user.userKey) {
      user.userKey = push(child(ref(this.db), 'users')).key;
      return;
    }
    return user.userKey;
  }
}
