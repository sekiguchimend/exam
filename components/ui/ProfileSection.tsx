import React, { useState, useEffect } from 'react';
import { FaUser, FaGoogle } from 'react-icons/fa';
import { auth } from '../../Firebase/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

const ProfileSection: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  return (
    <div className="w-1/3 p-4 bg-white rounded-lg shadow-md">
      {user ? (
        <div className="flex items-center mb-4">
          <p className="text-lg font-semibold">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center mb-4">
          <FaUser className="text-gray-400 mr-2" />
          <p>Not signed in</p>
          <button
            onClick={signIn}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
