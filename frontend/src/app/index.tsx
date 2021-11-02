/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import Wrapper from './wrapper';
import MainPage from './containers/MainPage';
import SignUpPage from './containers/SignUpPage';
import SignInPage from './containers/SignInPage';
import SearchResultPage from './containers/SearchResultPage';
import SongPage from './containers/SongPage';
import CreateSongPage from './containers/CreateSongPage';
import CoverPage from './containers/CoverPage';
import {
  CreateCoverRecordPage,
  CreateCoverPreviewPage,
  CreateCoverInfoPage,
} from './containers/CreateCoverPage';
import ProfilePage from './containers/ProfilePage';

// import { useTranslation } from 'react-i18next';

export function App() {
  // const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <div className="app">
        <Helmet
          titleTemplate="%s - Bandcruit"
          defaultTitle="Bandcruit"
          // htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Bandcruit" />
        </Helmet>

        <Wrapper>
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route exact path="/signin" component={SignInPage} />
            <Redirect to="/" />
          </Switch>
        </Wrapper>

        <GlobalStyle />
      </div>
    </BrowserRouter>
  );
}
