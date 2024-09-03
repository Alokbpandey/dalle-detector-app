import React, { useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data and redirect to sign-in page
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profile-menu">
      <div className="profile-icon" onClick={toggleMenu}>
        <FaUserCircle size={40} />
      </div>
      {isOpen && (
        <div className="menu">
          <button onClick={() => navigate('/profile')}>View Profile</button>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
