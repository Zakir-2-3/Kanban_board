import { useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";

import "./Header.scss";

import userAvatar from "../../assets/images/user-avatar.png";
import dropDownArrow from "../../assets/icons/dropdown-user-arrow.svg";

function Header(): JSX.Element {
  const [dropDown, setDropDown] = useState(false);
  const dropDownRef = useClickOutside<HTMLDivElement>(() => setDropDown(false));

  return (
    <header className="header">
      <div className="container">
        <div className="header__title">Awesome Kanban Board</div>
        <div
          className="header__user"
          onClick={() => setDropDown((prev) => !prev)}
          ref={dropDownRef}
        >
          <div className="header__user-img">
            <img src={userAvatar} alt="user-avatar" />
          </div>
          <div
            className={`header__user-arrow ${
              dropDown ? "header__user-arrow--active" : ""
            }`}
          >
            <img src={dropDownArrow} alt="dropdown-arrow" />
          </div>
          {dropDown && (
            <div className="header__user-dropdown header__user-dropdown--active">
              <a href="#!">Profile</a>
              <a href="#!">Log Out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
