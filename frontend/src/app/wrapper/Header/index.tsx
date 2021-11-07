import Search from 'app/components/Search';
import * as React from 'react';
import { ReactComponent as Cookie } from 'res/logo.svg';

interface Props {
  user?: UserInfo;
  onSearchClicked?: (key: string) => void;
  onSignInClicked: () => void;
  onSignUpClicked: () => void;
  onSignOutClicked: () => void;
  onProfileClicked: () => void;
}

export default function Header(props: Props) {
  const signInText = 'SignIn';
  const signUpText = 'SignUp';
  const signOutText = 'SignOut';
  const profileText = 'Profile';

  return (
    <div className="Header" data-testid="Header">
      <div className="logo">
        <Cookie />
      </div>
      <div className="searchWrapper">
        <Search onSearchClicked={props.onSearchClicked} />
      </div>
      {props.user ? (
        /* when logged in  */
        <div className="sign">
          <button
            className="button"
            id="signout_button"
            onClick={props.onSignOutClicked}
          >
            {signOutText}
          </button>
          <button
            className="button"
            id="profile_button"
            onClick={props.onProfileClicked}
          >
            {profileText}
          </button>
        </div>
      ) : (
        /* when not logged in  */
        <div className="sign">
          <button
            className="button"
            id="signin_button"
            onClick={props.onSignInClicked}
          >
            {signInText}
          </button>
          <button
            className="button"
            id="signup_button"
            onClick={props.onSignUpClicked}
          >
            {signUpText}
          </button>
        </div>
      )}
    </div>
  );
}
