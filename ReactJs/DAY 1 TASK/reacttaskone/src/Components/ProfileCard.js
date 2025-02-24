// Import React and the CSS file
import React from 'react';
import './ProfileCard.css';
import MyImage from '../Components/profile.jpeg'
// Create the ProfileCard component
const ProfileCard = () => {
  // Function to handle button click
  const handleClick = () => {
    console.log("Profile Clicked");
  };

  return (
    <div className="profile-card">
      <div className="profile-image">
        <img src={MyImage} alt='profile' />
      </div>
      <div className="profile-info">
        <h2 className="profile-name">Rajdeep Sinh Chavda</h2>
        <p className="profile-role">Software Developer</p>
        <p className="profile-description">
          My Name Is Rajdeep Sinh Chavda i am 21 years old
        </p>
      </div>

      <button 
        className="profile-button"
        onClick={handleClick}
      >
        View Profile
      </button>
    </div>
  );
};

export default ProfileCard;