// "use client"をimport文の前に移動
'use client';
import React, { useState, useEffect } from 'react';
import { firestore, storage, auth } from '../../Firebase/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import { FaThumbsUp } from 'react-icons/fa';
import ToDoList from '@/components/ui/ToDoList';
import ZoomSchedule from '@/components/ui/ZoomSchedule';

// 投稿の型定義
type Post = {
  id: string
  text: string
  createdAt: firebase.firestore.Timestamp
  likes: number
  subject: string
  isQuestion: boolean
  photoUrl?: string
  username: string // ユーザ名の追加
}

const Page = () => {
  // ステートの初期化
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [subject, setSubject] = useState('general');
  const [isQuestion, setIsQuestion] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [username, setUsername] = useState('');

  // 投稿の取得とリアルタイム同期
  useEffect(() => {
    const unsubscribe = firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const postsWithLikedBy = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          likes: doc.data().likes || 0,
          subject: doc.data().subject,
          isQuestion: doc.data().isQuestion,
          photoUrl: doc.data().photoUrl,
          username: doc.data().username // ユーザ名を取得
        }));
        setPosts(postsWithLikedBy);
      });
    return () => unsubscribe();
  }, []);

  // 新規投稿の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      console.error('ログインしてください');
      return;
    }
    let photoUrl = null;
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile);
    }
    await firestore.collection('posts').add({
      text: newPost,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      subject,
      isQuestion,
      photoUrl: photoUrl,
      username: username.trim(), // ユーザ名を追加
    });
    setNewPost('');
    setPhotoFile(null);
    setUsername('');
  };

  // いいねの処理
  const handleLike = async (postId: string) => {
    const postRef = firestore.collection('posts').doc(postId);
    const postDoc = await postRef.get();
    const post = postDoc.data();
    if (post) {
      const likedByArray = post.likedBy || []; // Check if likedBy exists, if not, initialize with an empty array
      const isLiked = likedByArray.includes(auth.currentUser?.uid || '');
      if (isLiked) {
        const updatedLikedBy = likedByArray.filter((uid: string) => uid !== auth.currentUser?.uid);
        await postRef.update({
          likes: post.likes - 1,
          likedBy: updatedLikedBy,
        });
      } else {
        const updatedLikedBy = [...likedByArray, auth.currentUser?.uid || ''];
        await postRef.update({
          likes: post.likes + 1,
          likedBy: updatedLikedBy,
        });
      }
    } else {
      console.error('Post document does not exist.');
    }
  };

  // 画像のアップロード処理
  const uploadPhoto = async (file: File) => {
    const storageRef = storage.ref()
    const fileRef = storageRef.child(`photos/${file.name}`)
    await fileRef.put(file)
    return await fileRef.getDownloadURL()
  }

  // サインアウト処理
  const handleSignOut = async () => {
    await auth.signOut()
  }

  // サインイン処理
  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(provider)
  }

  // レンダリング
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
    <div className="w-1/3 p-4 bg-white">
      {auth.currentUser ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <button
              onClick={handleSignOut}
              className="text-xs text-gray-800 hover:text-gray-900"
            >
              サインアウト
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center mb-4">
          <button onClick={signIn} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md">
            Googleでログイン
          </button>
        </div>
      )}
      <ToDoList />
    </div>
    <div className="w-2/3 p-4 bg-white">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold text-indigo-900">勉強掲示板</h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8 bg-white shadow-md rounded-lg p-6 border border-gray-400">
        <div className="flex items-center mb-4 space-x-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="新しい投稿..."
            className="w-3/4 h-24 px-3 py-2 text-base text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="名前"
            className="w-1/4 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-400"
          />
        </div>
        <div className="flex items-center mb-4 space-x-4">
          <label htmlFor="photo" className="text-gray-700">写真:</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <label htmlFor="photo" className="w-10 h-10 flex justify-center items-center bg-gray-200 cursor-pointer">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 9l5 5 5-5M7 9v11a2 2 0 002 2h6a2 2 0 002-2V9m-4-6v4m-4 0V3m8 4h4m-8 0H3m4 12v-4m-4 0v4m16-4h-4"></path></svg>
          </label>
        </div>
        <button
          type="submit"
          disabled={!auth.currentUser || !newPost.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-indigo-600"
        >
          投稿
        </button>
      </form>
      <ul className="w-full max-w-2xl">
        {posts.map((post) => (
          <li key={post.id} className="bg-white rounded-lg shadow-md p-4 mb-6 border-2 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-800">{post.username}</p>
              <div className="text-sm text-gray-600">
                {post.createdAt ? post.createdAt.toDate().toLocaleString() : ''}
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">{post.text}</p>
            {post.isQuestion && <p className="text-sm text-gray-700 mb-2">質問です</p>}
            <div className="flex items-center mb-2">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center text-gray-600 hover:text-indigo-600 mr-4`}
              >
                <FaThumbsUp className="mr-1" />
                {post.likes}
              </button>
            </div>
            {post.photoUrl && (
              <img src={post.photoUrl} alt="Post" className="max-w-full h-auto rounded-lg mb-4" />
            )}
          </li>
        ))}
      </ul>
    </div>
    <ZoomSchedule />
  </div>
  
  
  
  )
}

export default Page;
