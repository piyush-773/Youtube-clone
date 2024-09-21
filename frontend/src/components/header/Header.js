import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Header.css"; // Assuming you have a separate CSS file for styles

const Header = () => {
  return (
    <header className="header" id="header">
      {/* Logo Section */}
      <div className="header__logo">
        PK<span> Hub</span>
      </div>

      {/* Search Bar Section */}
      <div className="searchBar">
        <input type="text" placeholder="Search..." className="searchBar__input" />
      </div>

      {/* Navigation Section */}
      <nav className="nav">
        {/* User Profile Icon */}
        <div className="userProfile">
          <FontAwesomeIcon icon={faUser} className="userProfile__icon" />
          
          {/* Nav List that appears on hover */}
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#">Home</a>
            </li>
            <li className="nav-item">
              <a href="#">Subscriptions</a>
            </li>
            <li className="nav-item">
              <a href="#">Your Channel</a>
            </li>
            <li className="nav-item">
              <a href="#">History</a>
            </li>
            <li className="nav-item">
              <a href="#">Playlist</a>
            </li>
            <li className="nav-item">
              <a href="#">Your Videos</a>
            </li>
            <li className="nav-item">
              <a href="#">Liked Videos</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export { Header };
