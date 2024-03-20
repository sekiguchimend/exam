import React, { useState, useEffect } from 'react';
import { FaUser, FaGoogle, FaEdit, FaTimes } from 'react-icons/fa';
import { auth } from '../../Firebase/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

type User = {
  uid: string;
  username: string;
  profilePhotoUrl?: string;
};

const ProfileSection: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editProfilePhoto, setEditProfilePhoto] = useState<File | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { uid, displayName, photoURL } = user;
        setUser({ uid, username: displayName || '', profilePhotoUrl: photoURL });
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

  const handleUpdateUsername = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !editUsername.trim()) return;

    try {
      await currentUser.updateProfile({ displayName: editUsername });
      setEditUsername('');
      setIsEditingProfile(false);
      await currentUser.reload();
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleUpdateProfilePhoto = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!editProfilePhoto) {
      alert('Please select a profile photo');
      return;
    }

    try {
      const storageRef = firebase.storage().ref();
      const photoRef = storageRef.child(`profile-photos/${currentUser.uid}`);
      await photoRef.put(editProfilePhoto);
      const photoUrl = await photoRef.getDownloadURL();

      await currentUser.updateProfile({ photoURL: photoUrl });
      setEditProfilePhoto(null);
      setIsEditingProfile(false);
      await currentUser.reload();
    } catch (error) {
      console.error('Error updating profile photo:', error);
    }
  };

  const toggleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  return (
    <div className="w-1/3 p-4 bg-white rounded-lg shadow-md">
      {user ? (
        <div>
          <div className="flex items-center mb-4">
            <img
              src={`${user.profilePhotoUrl || '/default-profile.png'}?t=${Date.now()}`}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4 cursor-pointer"
              onClick={toggleEditProfile}
            />
            <div>
              <p className="text-lg font-semibold">{user.username}</p>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
            {isEditingProfile && (
              <FaEdit className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" onClick={toggleEditProfile} />
            )}
          </div>
          {isEditingProfile && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Profile</h3>
                <FaTimes className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" onClick={toggleEditProfile} />
              </div>
              <div>
                <label htmlFor="editProfilePhoto" className="block text-sm font-medium text-gray-700">
                  Change Profile Photo
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="editProfilePhoto"
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-300 cursor-pointer"
                  >
                    <FaEdit className="text-gray-600" />
                  </label>
                  <input
                    type="file"
                    id="editProfilePhoto"
                    accept="image/*"
                    onChange={(e) => setEditProfilePhoto(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="editUsername" className="block text-sm font-medium text-gray-700">
                  Change Username
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="text"
                    id="editUsername"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateUsername}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    名前を変更
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleUpdateProfilePhoto}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                 写真を変更
                </button>
              </div>
            </div>
          )}
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