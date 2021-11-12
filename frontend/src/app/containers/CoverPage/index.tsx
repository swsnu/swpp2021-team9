import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWrapperSlice } from 'app/wrapper/slice';
import { RouteComponentProps } from 'react-router-dom';
import { useCoverSlice } from './slice';
import * as apiActions from 'api/actions';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function CoverPage(props: Props) {
  const { actions } = useCoverSlice();
  const wrapperState = useSelector(useWrapperSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('start cover');
    dispatch(apiActions.loadCover.request('start load cover'));
  }, [dispatch]);

  return (
    <div data-testid="CoverPage">
      <div className="bg-red-500" onClick={e => console.log('outer', e)}>
        bigger bigger
      </div>
      <button
        className="bg-blue-500 absolute left-4 top-0"
        onClick={e => {
          console.log('inner', e);
          dispatch(apiActions.loadCover.request('start load button'));
        }}
      >
        inner
      </button>
    </div>
  );
}
