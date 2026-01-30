import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { logout } from './ProtectedRoute';
import maleProfilePic from './assets/athenor-male-pfp.jpg';
import femaleProfilePic from './assets/athenor-female-pfp.jpg';

// Helper function to get profile picture from user data
const getProfilePicFromUser = (user) => {
  if (!user?.profilePicture) return maleProfilePic;
  if (user.profilePicture === 'athenor-male-pfp') return maleProfilePic;
  if (user.profilePicture === 'athenor-female-pfp') return femaleProfilePic;
  if (user.profilePicture === 'athenor-female-pfp') return femaleProfilePic;
  if (user.profilePicture === 'fetch-from-backend') return maleProfilePic; // Placeholder until fetched
  if (user.profilePicture.startsWith('data:')) return user.profilePicture;
  return maleProfilePic;
};

// Get initial user data from localStorage synchronously
const getInitialUserData = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      name: user.fullName || '',
      picture: getProfilePicFromUser(user),
      needsFetch: user.profilePicture === 'fetch-from-backend',
      userId: user.id
    };
  } catch {
    return { name: '', picture: maleProfilePic, needsFetch: false, userId: null };
  }
};

export default function NavBar({ title, showBackButton = false, onBackClick = null }) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  // Initialize state directly from localStorage for instant display
  const initialData = useMemo(() => getInitialUserData(), []);
  const [profilePicture, setProfilePicture] = useState(initialData.picture);
  const [userName, setUserName] = useState(initialData.name);

  // Function to load profile picture from localStorage (demo mode)
  const loadProfileFromLocalStorage = (userId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update the displayed name
    if (currentUser.fullName) {
      setUserName(currentUser.fullName);
    }
    
    // Update profile picture
    if (currentUser.profilePicture) {
      if (currentUser.profilePicture === 'athenor-male-pfp') {
        setProfilePicture(maleProfilePic);
      } else if (currentUser.profilePicture === 'athenor-female-pfp') {
        setProfilePicture(femaleProfilePic);
      } else if (currentUser.profilePicture.startsWith('data:')) {
        setProfilePicture(currentUser.profilePicture);
      }
    }
  };

  // Function to load user data (demo mode - localStorage only)
  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.fullName) {
      setUserName(user.fullName);
    }
    setProfilePicture(getProfilePicFromUser(user));
    
    // Demo mode - load from localStorage
    if (user.id) {
      loadProfileFromLocalStorage(user.id);
    }
  };

  useEffect(() => {
    loadUserData();
    
    // Listen for storage changes (real-time sync across tabs/components)
    const handleStorageChange = (e) => {
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleProfileUpdate = () => {
      loadUserData();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Poll for changes every 500ms (for same-tab updates)
    const interval = setInterval(loadUserData, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <nav className={`w-full border-b backdrop-blur-xl ${
      isDarkMode
        ? 'bg-gray-800/90 border-gray-700'
        : 'bg-gradient-to-r from-blue-600/90 via-cyan-500/90 to-emerald-500/90'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT SIDE - Profile Picture and Name */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            {profilePicture && (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
            )}
            {userName && (
              <p className={`text-xs font-medium ${profilePicture ? 'mt-1' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-100'}`}>
                {userName}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Buttons */}
        <div className="flex items-center gap-8 text-gray-100 font-medium">
          {showBackButton && (
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Back
            </button>
          )}
          <button
            onClick={() => navigate('/settings')}
            className="hover:text-white transition">Settings</button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="hover:text-white transition">Logout</button>
        </div>
      </div>
    </nav>
  );
}
