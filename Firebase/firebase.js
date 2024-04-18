import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA7TwQZbXpz3do8HiWrnDHOT50rCgcopF8",
  authDomain: "exam-cb34f.firebaseapp.com",
  projectId: "exam-cb34f",
  storageBucket: "exam-cb34f.appspot.com",
  messagingSenderId: "137503489253",
  appId: "1:137503489253:web:d033b66555c44d7f84a80c",
  measurementId: "G-89SMMVEK7Y"
}

// Firebaseの初期化
firebase.initializeApp(firebaseConfig)
 export const db = firebase.firestore();
 export const auth = firebase.auth();
 export const storage = firebase.storage();
export const firestore = firebase.firestore();

// Storageサービスの取得

// 投稿の追加処理
export const handleSubmit = async (newPost, setNewPost, subject, isQuestion, photoFile, user) => {
  if (!newPost.trim() || !user) return
  const photoURL = photoFile ? await uploadPhoto(photoFile) : undefined
  await firestore.collection('posts').add({
    text: newPost,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    likes: 0,
    subject,
    isQuestion,
    photoURL,
    uid: user.uid,
    username: user.displayName,
    profilePhotoUrl: user.photoURL,
  })
  // Clear the input fields
  setNewPost('')
  setPhotoFile(null)
}

// 写真のアップロード処理
const uploadPhoto = async (file) => {
  const storageRef = storage.ref()
  const fileRef = storageRef.child(`photos/${file.name}`)
  await fileRef.put(file)
  return await fileRef.getDownloadURL()
}