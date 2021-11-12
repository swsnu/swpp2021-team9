import Search from 'app/components/Search';
import * as React from 'react';
import { ReactComponent as Logo } from 'res/logo.svg';

interface Props {
  user?: UserInfo;
  onSearchClicked?: (key: string) => void;
  onSignInClicked: () => void;
  onSignUpClicked: () => void;
  onSignOutClicked: () => void;
  onProfileClicked: () => void;
  onLogoClicked: () => void;
}

export default function Header(props: Props) {
  const signInText = 'Sign In';
  const signUpText = 'Sign Up';
  const signOutText = 'Sign Out';
  const profileText = 'Profile';

  const styles = {
    button:
      'mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900',
  };

  return (
    <div
      data-testid="Header"
      className="flex self-stretch items-center justify-between h-12 px-4 bg-gray-100"
    >
      <div
        id="logo_button"
        onClick={props.onLogoClicked}
        className="sr-only sm:not-sr-only flex-none sm:mx-4 justify-start"
      >
        <Logo />
      </div>
      <div className="flex-auto mx-4 max-w-lg">
        <Search onSearchClicked={props.onSearchClicked} />
      </div>
      {props.user ? (
        /* when logged in  */
        <div className="flex-none">
          <button
            id="signout_button"
            onClick={props.onSignOutClicked}
            className={styles.button}
          >
            {signOutText}
          </button>
          <button
            id="profile_button"
            onClick={props.onProfileClicked}
            className={styles.button}
          >
            {profileText}
          </button>
        </div>
      ) : (
        /* when not logged in  */
        <div className="flex-none">
          <button
            id="signin_button"
            onClick={props.onSignInClicked}
            className={styles.button}
          >
            {signInText}
          </button>
          <button
            id="signup_button"
            onClick={props.onSignUpClicked}
            className={styles.button}
          >
            {signUpText}
          </button>
        </div>
      )}
    </div>
  );
}
