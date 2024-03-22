'use client'

import { useState, useEffect } from 'react'
import { firestore, storage, auth } from '../../Firebase/firebase'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/auth'
import { FaThumbsUp, FaLink, FaUser, FaGoogle } from 'react-icons/fa'
import React from 'react'; // Reactをインポートすることを忘れないでください

type Post = {
  id: string
  text: string
  createdAt: firebase.firestore.Timestamp
  likes: number
  subject: string
  isQuestion: boolean
  photoUrl?: string
  uid: string
  username: string
  profilePhotoUrl?: string
}

type User = {
  uid: string
  username: string
  profilePhotoUrl?: string
}

const ZoomSchedule = () => {
  const schedules = [
    {
      title: '数学の勉強会',
      date: '2023年5月20日 19:00 - 21:00',
      link: 'https://zoom.us/j/1234567890',
    },
    {
      title: '英語の発音練習',
      date: '2023年5月25日 18:00 - 19:30',
      link: 'https://zoom.us/j/0987654321',
    },
    // 他のスケジュールを追加
  ]

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-md shadow-lg w-64">
      <h2 className="text-xl font-semibold mb-4 text-indigo-900">Zoomスケジュール</h2>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={index} className="mb-4">
            <h3 className="text-lg font-medium text-indigo-800">{schedule.title}</h3>
            <p className="text-sm text-gray-600">{schedule.date}</p>
            <a
              href={schedule.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {/* FaLinkコンポーネントを追加 */}
              <FaLink className="mr-2" />
              Zoomリンク
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};


const BoardPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [subject, setSubject] = useState('general')
  const [isQuestion, setIsQuestion] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [editUsername, setEditUsername] = useState('')
  const [editProfilePhotoFile, setEditProfilePhotoFile] = useState<File | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userRef = firestore.collection('users').doc(currentUser.uid);
        const userDoc = await userRef.get();
  
        if (!userDoc.exists) {
          // 新しいユーザーの場合、ユーザー情報をFirestoreに作成する
          await userRef.set({
            username: currentUser.displayName,
            profilePhotoUrl: currentUser.photoURL,
          });
        }
  
        const userData = userDoc.data();
if (userData) {
  setUser({
    uid: currentUser.uid,
    username: userData.username,
    profilePhotoUrl: userData.profilePhotoUrl,
  });
} else {
  // userData が取得できなかった場合の処理
}

      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          likes: doc.data().likes || 0,
          subject: doc.data().subject,
          isQuestion: doc.data().isQuestion,
          photoUrl: doc.data().photoUrl,
          uid: doc.data().uid,
          username: doc.data().username,
          profilePhotoUrl: doc.data().profilePhotoUrl,
        }))
        setPosts(posts)
      })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
  
    let photoUrl = null;
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile);
    }
  
    await firestore.collection('posts').add({
      text: newPost, // 新しい投稿の文字を追加
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      subject,
      isQuestion,
      photoUrl: photoUrl,
      uid: user.uid,
      username: user.username,
      profilePhotoUrl: user.profilePhotoUrl,
      likedBy: [],
    });
    setNewPost(''); // 投稿後に newPost を空に設定
    setPhotoFile(null);
  };

  const handleLike = async (postId: string) => {
    const postRef = firestore.collection('posts').doc(postId);
    const currentUser = auth.currentUser;
  
    if (!currentUser) return; // 認証ユーザーでない場合は早期リターン
  
    const postDoc = await postRef.get();
    const post = postDoc.data();
  
    if (post) {
      const isLiked = post.likedBy.includes(currentUser.uid);
  
      if (isLiked) {
        // すでにイイねしている場合はイイねを解除する
        const updatedLikedBy = post.likedBy.filter((uid: string) => uid !== currentUser.uid);
        await postRef.update({
          likes: post.likes - 1,
          likedBy: updatedLikedBy,
        });
      } else {
        // まだイイねしていない場合はイイねする
        const updatedLikedBy = [...post.likedBy, currentUser.uid];
        await postRef.update({
          likes: post.likes + 1,
          likedBy: updatedLikedBy,
        });
      }
    }
  };

  const uploadPhoto = async (file: File) => {
    const storageRef = storage.ref()
    const fileRef = storageRef.child(`photos/${file.name}`)
    await fileRef.put(file)
    return await fileRef.getDownloadURL()
  }

  const handleUpdateUsername = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !editUsername.trim()) return;
  
    await currentUser.updateProfile({ displayName: editUsername });
  
    const userRef = firestore.collection('users').doc(currentUser.uid);
    await userRef.update({ username: editUsername });
  
    const updatedUser: User = {
      uid: currentUser.uid || '', // uid が null または undefined の場合は空の文字列を代入する
      username: editUsername,
      profilePhotoUrl: user?.profilePhotoUrl, // もしユーザーが存在する場合、profilePhotoUrl を保持する
    };
  
    setUser(updatedUser);
  };
  
  
  const handleUpdateProfilePhoto = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !editProfilePhotoFile) return;
  
    const storageRef = storage.ref();
    const photoRef = storageRef.child(`profiles/${currentUser.uid}/profile.jpg`);
    await photoRef.put(editProfilePhotoFile);
    const photoUrl = await photoRef.getDownloadURL();
  
    await currentUser.updateProfile({ photoURL: photoUrl });
  
    const userRef = firestore.collection('users').doc(currentUser.uid);
    await userRef.update({ profilePhotoUrl: photoUrl });
  
    const updatedUser: User = {
      uid: currentUser.uid || '', // uid が null または undefined の場合は空の文字列を代入する
      username: user?.username || '', // もしユーザーが存在する場合、username を保持する。存在しない場合は空の文字列を代入する
      profilePhotoUrl: photoUrl,
    };
  
    setUser(updatedUser);
  };
  
  
  const handleSignOut = async () => {
    await auth.signOut()
  }

  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(provider)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      <div className="w-1/3 p-4 bg-white">
      {user ? (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex items-center mb-2">
      <img
        src={user.profilePhotoUrl || '/default-profile.png'}
        alt="Profile"
        className="w-10 h-10 rounded-full mr-2"
      />
      <div>
        <p className="text-sm font-semibold">{user.username}</p>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          サインアウト
        </button>
      </div>
    </div>
    <div className="mb-4">
      <label htmlFor="editUsername" className="block text-xs font-medium text-gray-700 mb-1">
        ユーザー名変更
      </label>
      <div className="flex">
        <input
          type="text"
          id="editUsername"
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
          className="flex-grow py-1 px-2 border border-gray-300 rounded-l-md shadow-sm text-xs leading-4 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleUpdateUsername}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-2 rounded-r-md text-xs"
        >
          更新
        </button>
      </div>
    </div>
    <div className="mb-4">
      <label htmlFor="editProfilePhoto" className="block text-xs font-medium text-gray-700 mb-1">
        プロフィール写真の変更
      </label>
      <div className="flex">
        <input
          type="file"
          id="editProfilePhoto"
          accept="image/*"
          onChange={(e) => setEditProfilePhotoFile(e.target.files?.[0] || null)}
          className="flex-grow py-1 px-2 border border-gray-300 rounded-l-md shadow-sm text-xs leading-4 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {editProfilePhotoFile && (
          <button
            type="button"
            onClick={handleUpdateProfilePhoto}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-2 rounded-r-md text-xs"
          >
            アップロード
          </button>
        )}
      </div>
    </div>
  </div>
) : (
  
          <div className="flex items-center mb-4">
            <FaUser className="text-gray-400 mr-2" />
            <p>ログインしていません</p>
            <button
              onClick={signIn}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FaGoogle className="mr-2" />
              Googleでログイン
            </button>
          </div>
        )}
        <form>
          <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 text-indigo-900">皆の模試結果</h2>

            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              模試の結果写真
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              />
              {photoFile && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  アップロード
                </button>
              )}
            </div>
          </div>
        </form>
        <div>
  {posts.map((post) =>
    post.photoUrl ? (
      <div key={post.id} className="bg-white rounded-lg shadow-md p-4 mb-6">
        <img src={post.photoUrl} alt="模試結果" className="max-w-full h-auto rounded-lg mb-4" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img
              src={post.profilePhotoUrl || '/default-profile.png'}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="text-sm font-medium">{post.username}</p>
          </div>
          <div className="text-sm text-gray-500">
            {post.createdAt ? post.createdAt.toDate().toLocaleString() : ''}
          </div>
        </div>
      </div>
    ) : null
  )}
</div>
      </div>
      

      <div className="w-2/3 p-4 bg-white">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-indigo-900">勉強掲示板</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
          <div className="flex">
            <input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="新しい投稿..."
              className="flex-grow py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!user}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-r-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              投稿
            </button>
          </div>
          <div className="flex items-center mt-2">
            <label htmlFor="subject" className="mr-2 text-gray-700">
              科目:
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="py-1 px-2 border border-gray-300 rounded-md"
            >
              <option value="general">一般</option>
              <option value="math">数学</option>
              <option value="science">理科</option>
              <option value="english">英語</option>
            </select>
            <label htmlFor="isQuestion" className="ml-4 text-gray-700">
              <input
                id="isQuestion"
                type="checkbox"
                checked={isQuestion}
                onChange={(e) => setIsQuestion(e.target.checked)}
                className="mr-1"
              />
              質問
            </label>
          </div>
        </form>
        <ul className="w-full max-w-2xl">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white p-4 rounded-md shadow-md mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-md ${
                    post.isQuestion
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >{post.isQuestion ? '質問' : '投稿'}
                </span>
                <span className="text-sm text-gray-500">{post.subject}</span>
                </div>
                <div className="flex items-center mb-2">
                <img
                  src={post.profilePhotoUrl || '/default-profile.png'}
                  alt="Profile"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <p className="text-sm font-medium">{post.username}</p>
                </div>
                <p className="text-lg mb-2">{post.text}</p>
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`text-orange-600 hover:text-orange-700 focus:outline-none mr-2 ${
                  post.likedBy && post.likedBy.includes(user?.uid || '') ? 'text-orange-700' : ''
                   }`}
                   disabled={!user}
                        >
                    <FaThumbsUp className="h-5 w-5" />
                    </button>
                  <span className="text-gray-500">{post.likes}</span>
                </div>
                <small className="text-gray-500">
                  {post.createdAt ? post.createdAt.toDate().toLocaleString() : ''}
                </small>
                </div>

                </li>
                ))}
                </ul>

       </div>
       
    <ZoomSchedule />
  </div>

     

                )
                }

                export default BoardPage
