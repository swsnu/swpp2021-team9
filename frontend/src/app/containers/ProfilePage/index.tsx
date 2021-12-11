import { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileSlice } from './slice';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import * as apiActions from 'api/actions';
import { selectProfile } from './slice/selectors';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import * as urls from 'utils/urls';
import { useProfile } from './hook';
import { format } from 'path';

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}
const instrument_name_list = ['Bass', 'Guitar', 'Vocals', 'Drum', 'Keyboard'];

export default function ProfilePage(props: Props) {
  const {
    onChangeDescription,
    onChangeName,
    onChangeInstruments,
    onChangePicture,
    form,
    userForm,
  } = useProfile(props);

  /* Start of crop related functions, variables*/
  const [upImg, setUpImg] = useState(null as any);
  const imgRef = useRef(null as any);
  const previewCanvasRef = useRef(null as any);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 30,
    aspect: 1 / 1,
  } as any);

  const [completedCrop, setCompletedCrop] = useState(null as any);
  const [croppedImg, setCroppedImg] = useState(null as any);
  const [Bio, setBio] = useState(form.description);
  const [Name, setName] = useState(null as any);

  /* Save checked Instruments */
  //const [Instruments, setInstruments] = useState ([] as any);
  const [checkedBass, setCheckedBass] = useState(false);
  const [checkedGuitar, setCheckedGuitar] = useState(false);
  const [checkedVocals, setCheckedVocals] = useState(false);
  const [checkedDrum, setCheckedDrum] = useState(false);
  const [checkedKeyboard, setCheckedKeyboard] = useState(false);
  const fileName: string = '';

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as any));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

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

    /* Newly Added*/
    const croppedimage = new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = 'croppedImg';
        resolve(file);
      }, 'image/png');
    });
    setCroppedImg(croppedimage);
  }, [completedCrop]);
  /* End of crop related functions, variables*/

  function onEditBio(event) {
    let modified_bio = prompt('Edit your Bio', Bio);
    if (modified_bio != null) {
      setBio(modified_bio);
      onChangeDescription(modified_bio);
    }
  }

  function onEditName(event) {
    let modified_name = prompt('Edit your Name', Name);
    if (modified_name != null) {
      setName(modified_name);
      onChangeName(modified_name);
    }
  }

  let Instruments: number[] = [];
  function onChooseInstruments(event) {
    if (checkedBass) Instruments.push(0);
    if (checkedGuitar) Instruments.push(1);
    if (checkedVocals) Instruments.push(2);
    if (checkedDrum) Instruments.push(3);
    if (checkedKeyboard) Instruments.push(4);

    alert('Your instruments have been saved !');
    onChangeInstruments(Instruments);
  }

  function onEditPicture(event) {
    /* TODO : how to send photo as blob */
    onChangePicture(croppedImg);
  }
  const handleChangeBass = () => {
    setCheckedBass(!checkedBass);
  };

  const handleChangeGuitar = () => {
    setCheckedGuitar(!checkedGuitar);
  };

  const handleChangeVocals = () => {
    setCheckedVocals(!checkedVocals);
  };

  const handleChangeDrum = () => {
    setCheckedDrum(!checkedDrum);
  };

  const handleChangeKeyboard = () => {
    setCheckedKeyboard(!checkedKeyboard);
  };

  // Basic Info area
  // 1. Profile Photo
  // 2. Name
  // 3. Followers
  // 4. Folowing Count
  // Here, you should be able to edit photo, name
  // 5. Show cover list of users
  // 6. Bio Area : Edit their bio

  /* TODO */
  // 1. User cover list
  // 2. user/info/<id:int>
  // GET [User Info]
  // followers
  // covers
  // PUT
  // username
  // photo
  // instrument

  return (
    <div data-testid="ProfilePage">
      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-blue-800">
              <div className="image overflow-hidden">
                <label
                  className="
                    w-64
                    flex flex-col
                    items-center
                    px-4
                    py-6
                    bg-white
                    rounded-md
                    shadow-md
                    tracking-wide
                    uppercase
                    border border-blue
                    cursor-pointer
                    hover:bg-blue-800 hover:text-white
                    text-blue-800
                    ease-linear
                    transition-all
                    duration-150
                  "
                >
                  <i className="fas fa-cloud-upload-alt fa-3x"></i>
                  <span className="mt-2 text-base leading-normal">
                    Select your profile picture
                  </span>
                  <input
                    data-testid="uploadFile"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onSelectFile}
                  />
                </label>
                <br></br>
                <br></br>
                <ReactCrop
                  src={upImg}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                />

                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: Math.round(completedCrop?.width ?? 0),
                    height: Math.round(completedCrop?.height ?? 0),
                  }}
                />

                <div className="bg-white p-3 hover:shadow">
                  <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
                    <img src={userForm.photo} />
                    <button
                      data-testid="editPictureButton"
                      id="editpicture_button"
                      className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
                      onClick={onEditPicture}
                    >
                      Edit Profile Picture
                    </button>
                  </div>
                </div>

                <br></br>
                <div className="bg-white p-3 hover:shadow">
                  <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
                    <span className="text-blue-800">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                    <span>Bio</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                  {form.description}
                </p>
                <br></br>
                <button
                  id="signin_button"
                  className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
                  onClick={onEditBio}
                >
                  Edit Bio
                </button>
              </div>
            </div>

            <div className="my-4"></div>

            <div className="bg-white p-3 hover:shadow">
              <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
                <span className="text-blue-800">
                  <svg
                    className="h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                <span> Following </span>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-center my-2">
                  <img
                    src={
                      userForm.followings[0]
                        ? userForm.followings[0].photo
                        : undefined
                    }
                  />
                  <a href="#" className="text-main-color">
                    {userForm.followings[0]
                      ? userForm.followings[0].username
                      : undefined}
                  </a>
                </div>
                <div className="text-center my-2">
                  <img
                    src={
                      userForm.followings[1]
                        ? userForm.followings[1].photo
                        : undefined
                    }
                  />
                  <a href="#" className="text-main-color">
                    {userForm.followings[1]
                      ? userForm.followings[1].username
                      : undefined}
                  </a>
                </div>
                <div className="text-center my-2">
                  <img
                    src={
                      userForm.followings[2]
                        ? userForm.followings[2].photo
                        : undefined
                    }
                  />
                  <a href="#" className="text-main-color">
                    {userForm.followings[2]
                      ? userForm.followings[2].username
                      : undefined}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-blue-800">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">About</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Name</div>
                    <div className="px-4 py-2">{form.username}</div>
                    <button
                      id="signin_button"
                      className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
                      onClick={onEditName}
                    >
                      Edit Name
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4"></div>

            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid grid-cols">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-blue-800">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                          fill="#fff"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Instruments</span>
                  </div>
                  <div flex-row>
                    <div>
                      <label className="inline-flex items-center">
                        <input
                          data-testid="checkbass"
                          type="checkbox"
                          className="form-checkbox"
                          checked={checkedBass}
                          onClick={handleChangeBass}
                        />
                        <span className="ml-2">{instrument_name_list[0]}</span>
                      </label>
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          data-testid="checkguitar"
                          type="checkbox"
                          className="form-checkbox"
                          checked={checkedGuitar}
                          onClick={handleChangeGuitar}
                        />
                        <span className="ml-2">{instrument_name_list[1]}</span>
                      </label>
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          data-testid="checkvocals"
                          type="checkbox"
                          className="form-checkbox"
                          checked={checkedVocals}
                          onClick={handleChangeVocals}
                        />
                        <span className="ml-2">{instrument_name_list[2]}</span>
                      </label>
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          data-testid="checkdrum"
                          type="checkbox"
                          className="form-checkbox"
                          checked={checkedDrum}
                          onClick={handleChangeDrum}
                        />
                        <span className="ml-2">{instrument_name_list[3]}</span>
                      </label>
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          data-testid="checkkeyboard"
                          type="checkbox"
                          className="form-checkbox"
                          checked={checkedKeyboard}
                          onClick={handleChangeKeyboard}
                        />
                        <span className="ml-2">{instrument_name_list[4]}</span>
                      </label>
                    </div>
                    <br></br>
                    <button
                      data-testid="chooseInstrument"
                      id="signin_button"
                      className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
                      onClick={onChooseInstruments}
                    >
                      Choose Instruments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
