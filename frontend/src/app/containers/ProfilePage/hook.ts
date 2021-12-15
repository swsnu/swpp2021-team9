import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useProfileSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectProfile } from './slice/selectors';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import * as urls from 'utils/urls';
import { Props } from '.';

const initForm: UserPostForm = {
  id: -1,
  username: 'Your ID',
  description: 'Your Description',
  photo: new Blob([]),
  instruments: [],
};

export const useProfile = (props: Props) => {
  useProfileSlice();

  const wrapperState = useSelector(selectWrapper);
  const pageState = useSelector(selectProfile);
  const history = useHistory();
  const dispatch = useDispatch();

  const profileResponse = pageState.profileResponse;
  const postProfileResponse = pageState.postProfileResponse;

  const [form, setForm] = useState<UserPostForm>({
    ...initForm,
    id: Number(props.match.params.id),
  });
  const [photo, setPhoto] = useState<string>('');
  const [followings, setFollowings] = useState<UserInfo[]>([]);

  // handle initial state
  useEffect(() => {
    dispatch(apiActions.loadProfile.request(Number(props.match.params.id)));
  }, []);

  useEffect(() => {
    if (!wrapperState.user) {
      alert('You have to login to see profile page');
      history.replace(urls.Main());
    } else if (!profileResponse.loading) {
      if (profileResponse.error) {
        alert('Failed to load original data');
        history.replace(urls.Main());
      } else if (profileResponse.data) {
        const user = profileResponse.data;

        if (user.id !== wrapperState.user.id) {
          alert('You cannot edit this cover');
          history.replace(urls.Main());
        } else {
          setForm({
            id: user.id,
            username: user.username,
            description: user.description,
            instruments: user.instruments,
          });
          setPhoto(user.photo);
          setFollowings(user.followings);
        }
      }
    }
  }, [
    profileResponse,
    dispatch,
    form,
    history,
    props.match.params.id,
    wrapperState.user,
  ]);

  // handle post response
  useEffect(() => {
    if (!postProfileResponse.loading) {
      if (postProfileResponse.error) {
        alert('Failed to save' + postProfileResponse.error);
      }
    }
  }, [postProfileResponse]);

  const onChangeDescription = useCallback(
    (modified_bio: string) => {
      setForm({ ...form, description: modified_bio });
      //console.log(modified_bio);
    },
    [form],
  );

  const onChangeName = useCallback(
    (modified_name: string) => {
      setForm({ ...form, username: modified_name });
      //console.log(modified_name);
    },
    [form],
  );

  const onChangeInstruments = useCallback(
    (Instruments: number[]) => {
      setForm({ ...form, instruments: Instruments });
      console.log(Instruments);
    },
    [form],
  );

  const onChangePicture = useCallback(
    (Photo: Blob) => {
      setForm({ ...form, photo: Photo });
      //console.log(Photo);
    },
    [form],
  );

  const onSave = useCallback(() => {
    dispatch(apiActions.postProfile.request(form));
    console.log('Form updated!');
  }, []);

  return {
    onChangeDescription,
    onChangeName,
    onChangeInstruments,
    onChangePicture,
    onSave,
    form,
    photo,
    followings,
  };
};
