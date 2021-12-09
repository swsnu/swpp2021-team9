import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCoverEditSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectCoverEdit } from './slice/selectors';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import * as urls from 'utils/urls';
import { Props } from '.';

const initForm: CoverFormPut = {
  id: -1,
  title: '',
  description: '',
  tags: [],
};

export const useCoverEdit = (props: Props) => {
  useCoverEditSlice();
  const wrapperState = useSelector(selectWrapper);
  const pageState = useSelector(selectCoverEdit);
  const history = useHistory();
  const dispatch = useDispatch();

  const coverResponse = pageState.coverResponse;
  const editResponse = pageState.editResponse;

  const [form, setForm] = useState<CoverFormPut>(initForm);
  const [tagInput, setTagInput] = useState<string>('');

  // handle init state
  useEffect(() => {
    if (!wrapperState.user) {
      alert('You have to login for edit cover');
      history.replace(urls.Main());
    } else if (coverResponse.error) {
      alert('Failed to load original data');
      history.replace(urls.Main());
    } else if (coverResponse.data) {
      const cover = coverResponse.data;
      if (cover.user.id !== wrapperState.user.id) {
        alert('You cannot edit this cover');
        history.replace(urls.Main());
      } else if (cover.id !== form.id) {
        setForm({
          id: cover.id,
          title: cover.title,
          description: cover.description ?? '',
          tags: cover.tags,
        });
      }
    } else if (!coverResponse.loading) {
      dispatch(apiActions.loadCover.request(Number(props.match.params.id)));
    }
  }, [
    coverResponse,
    dispatch,
    form,
    history,
    props.match.params.id,
    wrapperState.user,
  ]);

  // handle edit response
  useEffect(() => {
    if (!editResponse.loading) {
      if (editResponse.error) {
        alert('Failed to save' + editResponse.error);
      } else if (editResponse.data) {
        history.replace(urls.Cover(props.match.params.id));
      }
    }
  }, [editResponse, history, props.match.params.id]);

  const onChangeForm = useCallback(
    (e: React.FormEvent<HTMLInputElement>, key: string) => {
      setForm({ ...form, [key]: e.currentTarget.value });
    },
    [form],
  );

  const onKeyPress = useCallback(
    (e: { key: string }) => {
      if (e.key === 'Enter') {
        if (!form.tags.includes(tagInput)) {
          setForm({ ...form, tags: [...form.tags, tagInput] });
        }
        setTagInput('');
      }
    },
    [form, tagInput],
  );

  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(apiActions.editCover.request(form));
    },
    [dispatch, form],
  );

  const onTagClicked = useCallback(
    (tag: string) => {
      setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    },
    [form],
  );

  const submitDisabled = React.useMemo(
    () => form.title === '' || editResponse.loading,
    [form.title, editResponse],
  );

  return {
    onChangeForm,
    onKeyPress,
    onSubmitForm,
    onTagClicked,
    submitDisabled,
    form,
    tagInput,
    setTagInput,
  };
};
