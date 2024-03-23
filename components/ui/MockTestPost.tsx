// MockTestPost.tsx
import React, { useState, useEffect } from 'react';
import { firestore, storage, auth } from '../../Firebase/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

type MockTest = {
  id: string;
  text: string;
  createdAt: firebase.firestore.Timestamp;
  photoUrl?: string;
  uid: string;
  username: string;
  profilePhotoUrl?: string;
};

type User = {
  uid: string;
  username: string;
  profilePhotoUrl?: string;
};

interface MockTestPostProps {
  user: User | null;
}

const MockTestPost: React.FC<MockTestPostProps> = ({ user }) => {
  const [newPost, setNewPost] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('mockTests')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const mockTests = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          photoUrl: doc.data().photoUrl,
          uid: doc.data().uid,
          username: user?.username || '',
          profilePhotoUrl: user?.profilePhotoUrl,
        }));
        setMockTests(mockTests);
      });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    let photoUrl = null;
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile);
    }

    // subjectとisQuestionの値を設定する
    const subject = '模試'; // または任意の値
    const isQuestion = false; // または任意の値

    await firestore.collection('posts').add({
      text: newPost,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      subject,
      isQuestion,
      photoUrl,
      uid: user.uid,
      username: user.username,
      profilePhotoUrl: user.profilePhotoUrl,
      likedBy: [],
    });
    setNewPost('');
    setPhotoFile(null);
  };

  const uploadPhoto = async (file: File) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`mockTests/${file.name}`);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  };

  return (
    <div className="w-full max-w-2xl mb-8">
      <h1 className="text-4xl font-bold text-indigo-800">模試投稿</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="新しいモックテスト投稿..."
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
        <input
          type="file"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </form>
      <ul>
        {mockTests.map((mockTest) => (
          <li key={mockTest.id} className="bg-white p-4 rounded-md shadow-md mb-4">
            <div className="flex items-center mb-2">
              <img
                src={mockTest.profilePhotoUrl || '/default-profile.png'}
                alt="Profile"
                className="w-6 h-6 rounded-full mr-2"
              />
              <p className="text-sm font-medium">{mockTest.username}</p>
            </div>
            <p className="text-lg mb-2">{mockTest.text}</p>
            {mockTest.photoUrl && (
              <img src={mockTest.photoUrl} alt="Mock Test" className="max-w-full h-auto mb-2" />
            )}
            <small className="text-gray-500">
              {mockTest.createdAt ? mockTest.createdAt.toDate().toLocaleString() : ''}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};