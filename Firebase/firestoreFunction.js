import firestore from './firebase'; // Firestoreのインスタンスをインポート

// 掲示板のデータを取得する関数
export async function fetchPosts() {
  const postsRef = firestore.collection('posts');
  const snapshot = await postsRef.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 掲示板に新しいメッセージを追加する関数
export async function addPost(message) {
  const postsRef = firestore.collection('posts');
  await postsRef.add({ message, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
}
