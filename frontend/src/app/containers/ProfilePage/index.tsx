import { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { RouteComponentProps } from 'react-router-dom';
import { useProfile } from './hook';
import { useSelector } from 'react-redux';
import { selectCreateCover } from '../CreateCoverPage/slice/selectors';

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
    onSave,
    form,
    photo,
  } = useProfile(props);

  /* Start of crop related functions, variables*/
  const [upImg, setUpImg] = useState(null as any);
  const imgRef = useRef(null as any);
  const previewCanvasRef = useRef(null as any);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 30,
    aspect: 1,
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
    // const croppedimage = new Promise((resolve, reject) => {
    //   canvas.toBlob(file => {
    //     file.name = 'croppedImg';
    //     resolve(file);
    //   }, 'image/png');
    // });
    // setCroppedImg(croppedimage);
    canvas.toBlob(blob => {
      blob.name = 'croppedImg';
      setCroppedImg(URL.createObjectURL(blob));
      //setPhotoUrl(URL.createObjectURL(blob));
      //console.log(URL.createObjectURL(blob));
    }, 'image/png');
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
    //console.log(croppedImg);
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

  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    input:
      'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
  };

  return (
    <div data-testid="ProfilePage" className="flex flex-col items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        🤗 Upload Your Profile 🤗
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Upload your profile to meet more musicians!
      </p>
      <div className="w-full sm:w-3/4 max-w-screen-md m-5">
        <form className="shadow border overflow-hidden sm:rounded-md"></form>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="px-4 py-2 font-semibold">📌 Name</div>
        <div className="px-4 py-2">{form.username}</div>
        <button
          id="editnameButton"
          className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
          onClick={onEditName}
        >
          Edit Your Name !
        </button>
        <div className="px-4 py-2 font-semibold">📌 Bio</div>
        <div className="px-4 py-2">{form.description}</div>
        <button
          id="editnameButton"
          className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
          onClick={onEditBio}
        >
          Edit your Bio !
        </button>
        <div className="px-4 py-2 font-semibold">📌 Instruments</div>
        <div className="grid col-2 px-4 py-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={handleChangeBass}
            />
            <div className="px-4 py-2"> {instrument_name_list[0]} </div>
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={handleChangeGuitar}
            />
            <div className="px-4 py-2"> {instrument_name_list[1]} </div>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={handleChangeVocals}
            />
            <div className="px-4 py-2"> {instrument_name_list[2]} </div>
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={handleChangeDrum}
            />
            <div className="px-4 py-2"> {instrument_name_list[3]} </div>
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={handleChangeKeyboard}
            />
            <div className="px-4 py-2"> {instrument_name_list[4]} </div>
          </label>
        </div>
        <button
          id="editnameButton"
          className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
          onClick={onChooseInstruments}
        >
          Choose Instruments !
        </button>
        <div></div>
        <p className="mt-1 text-sm text-gray-600">
          Last but not least, update your photo !
        </p>
        <div></div>
        <div className="px-4 py-2 font-semibold">📷 Photo </div>
        <div className="image overflow-hidden">
          <label
            className="
                    w-64
                    flex flex-col
                    items-center
                    px-2
                    py-0
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
            <div className="px-4 py-2 font-semibold">
              Select your Profile Picture
            </div>
            <input
              data-testid="uploadFile"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onSelectFile}
            />
          </label>
        </div>
        <button
          id="editprofileButton"
          className="mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
          onClick={onEditPicture}
        >
          Edit Profile Picture !
        </button>
        <img src={photo} />
      </div>
      <div></div>
      <div className="grid grid-cols-3 gap-4">
        <div></div>
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
        <div></div>
        <p className="mt-1 text-sm text-gray-600">
          If you're ready,please submit your changes !
        </p>
        <div></div>
        <div></div>
        <button
          id="editnameButton"
          className="mx-1 py-4 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900"
          onClick={onSave}
        >
          ❗ Submit your Change ❗
        </button>
        <div></div>
      </div>
    </div>
  );
}
