import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
  return (
    <nav>
      {userObj.photoURL && (
        <img src={userObj.photoURL} width="50px" alt="Profile" />
      )}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}'s Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
