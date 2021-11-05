import * as React from 'react';
import { ReactComponent as Cookie } from 'res/logo.svg';

interface Props {
  user?: UserInfo;
}

export default function Header(props: Props) {
  const signInText = 'SignIn';
  const signUpText = 'SignUp';

  return (
    <div className="Header" data-testid="Header">
      <div className="logo">
        <Cookie />
      </div>
      <div className="search">Search</div>
      <div className="sign">
        <button className="button" id="signin_button">
          {signInText}
        </button>
        <button className="button" id="signin_button">
          {signUpText}
        </button>
      </div>
    </div>
  );
}
