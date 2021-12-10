/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Helmet } from 'react-helmet-async';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import Wrapper from './wrapper';
import MainPage from './containers/MainPage';
import SignUpPage from './containers/SignUpPage';
import SignInPage from './containers/SignInPage';
import SearchResultPage from './containers/SearchResultPage';
import SongPage from './containers/SongPage';
import CreateSongPage from './containers/CreateSongPage';
import CoverPage from './containers/CoverPage';
import {
  CreateCoverInfo,
  CreateCoverRecord,
} from './containers/CreateCoverPage';
import ProfilePage from './containers/ProfilePage';

import * as url from 'utils/urls';
import CoverEditPage from './containers/CoverEditPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Helmet titleTemplate="%s - MetaBand" defaultTitle="MetaBand">
          <meta name="description" content="MetaBand" />
        </Helmet>

        <Wrapper>
          <Switch>
            <Route exact path={url.Main()} component={MainPage} />
            <Route exact path={url.SignUp()} component={SignUpPage} />
            <Route exact path={url.SignIn()} component={SignInPage} />
            <Route
              exact
              path={url.SearchResult()}
              component={SearchResultPage}
            />
            <Route exact path={url.CreateSong()} component={CreateSongPage} />
            <Route exact path={url.Song(':id')} component={SongPage} />
            <Route exact path={url.Cover(':id')} component={CoverPage} />
            <Route
              exact
              path={url.CreateCover('record')}
              component={CreateCoverRecord}
            />
            <Route
              exact
              path={url.CoverEdit(':id')}
              component={CoverEditPage}
            />
            <Route
              exact
              path={url.CreateCover('info')}
              component={CreateCoverInfo}
            />
            <Route exact path={url.Song(':id')} component={CoverPage} />
            <Route exact path={url.Profile(':id')} component={ProfilePage} />
            <Redirect to={url.Main()} />
          </Switch>
        </Wrapper>
      </div>
    </BrowserRouter>
  );
}
