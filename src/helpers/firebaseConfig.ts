import 'firebase/compat/auth';

import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBxhbbmP0LB60zD4VCEi8ZSp21krc4DoJ4',
  authDomain: 'lyme-fdb26.firebaseapp.com',
  projectId: 'lyme-fdb26',
  storageBucket: 'lyme-fdb26.appspot.com',
  messagingSenderId: '242778843413',
  appId: '1:242778843413:web:5cae62ff67fbfc43a5611c',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth, firebase };
