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

import MainPage from './pages/MainPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import SearchResultPage from './pages/SearchResultPage';
import SongPage from './pages/SongPage';
import CreateSongPage from './pages/CreateSongPage';
import CoverPage from './pages/CoverPage';
import {
  CreateCoverRecordPage,
  CreateCoverPreviewPage,
  CreateCoverInfoPage,
} from './pages/CreateCoverPage';
import ProfilePage from './pages/ProfilePage';

// import { useTranslation } from 'react-i18next';

export function App() {
  // const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <div className="App">
        <Helmet
          titleTemplate="%s - Bandcruit"
          defaultTitle="Bandcruit"
          // htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Bandcruit" />
        </Helmet>

        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
          <Redirect to="/" />
        </Switch>
        <GlobalStyle />
      </div>
    </BrowserRouter>
  );
}
