import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { profileActions, useProfileSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectProfile } from './slice/selectors';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import * as urls from 'utils/urls';
import { Props } from '.';
import { Crop } from 'react-image-crop';

const initForm: UserPostForm = {
  id: -1,
  username: 'Your ID',
  description: 'Your Description',
  photo: '',
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

  // handle initial state
  useEffect(() => {
    return () => {
      dispatch(profileActions.clearRedux());
    };
  }, [dispatch, props.match.params.id]);

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
        }
      } else {
        dispatch(apiActions.loadProfile.request(Number(props.match.params.id)));
      }
    }
  }, [
    profileResponse,
    dispatch,
    history,
    props.match.params.id,
    wrapperState.user,
  ]);

  // handle post response
  useEffect(() => {
    if (!postProfileResponse.loading) {
      if (postProfileResponse.error) {
        alert('Failed to save' + postProfileResponse.error);
      } else if (postProfileResponse.data) {
        alert('saved');
        history.replace(urls.Main());
      }
    }
  }, [history, postProfileResponse]);

  const onChangeForm = useCallback(
    (key: string, value: any) => {
      switch (key) {
        case 'description':
          setForm({ ...form, description: value });
          break;
        case 'username':
          setForm({ ...form, username: value });
          break;
        case 'instruments':
          setForm({ ...form, instruments: value });
          break;
        case 'photo':
          setPhoto(value);
          break;
      }
    },
    [form],
  );

  const onSaveClick = useCallback(() => {
    dispatch(apiActions.postProfile.request(form));
  }, [dispatch, form]);

  return {
    onChangeForm,
    onSaveClick,
    form,
    photo,
  };
};

export const useCropImage = () => {
  /* Start of crop related functions, variables*/
  const [upImg, setUpImg] = useState(null as any);
  const imgRef = useRef(null as any);
  const previewCanvasRef = useRef(null as any);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 30,
    aspect: 1,
  } as any);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [croppedImg, setCroppedImg] = useState<string | null>(null);

  const onSelectFile = useCallback((e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as any));
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const onCompleteCrop = useCallback((crop: Crop) => {
    if (!previewCanvasRef.current || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    canvas.toBlob((blob: { name: string }) => {
      blob.name = 'croppedImg';
      setCroppedImg(URL.createObjectURL(blob));
    }, 'image/png');
    setCompletedCrop(crop);
  }, []);

  return {
    onSelectFile,
    upImg,
    setUpImg,
    croppedImg,
    setCroppedImg,
    onLoad,
    crop,
    setCrop,
    completedCrop,
    onCompleteCrop,
    previewCanvasRef,
  };
};
