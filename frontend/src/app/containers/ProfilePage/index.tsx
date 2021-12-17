import { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { RouteComponentProps } from 'react-router-dom';
import { useCropImage, useProfile } from './hook';

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}
const instrument_name_list = ['Bass', 'Guitar', 'Vocals', 'Drum', 'Keyboard'];

export default function ProfilePage(props: Props) {
  const { onChangeForm, onSaveClick, form, photo } = useProfile(props);
  const {
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
  } = useCropImage();

  /* Save checked Instruments */
  const [checkList, setCheckList] = useState(
    Array.from({ length: instrument_name_list.length }, () => false),
  );

  function onEditBioClick(_event: any) {
    let description = prompt('Edit your Bio', form.description);
    if (description != null) {
      onChangeForm('description', description);
    }
  }

  function onEditNameClick(_event: any) {
    let username = prompt('Edit your Name', form.username);
    if (username != null) {
      onChangeForm('username', username);
    }
  }

  function onChooseInstruments(_event: any) {
    const instruments: number[] = [];
    checkList.forEach((value, idx) => {
      if (value) instruments.push(idx);
    });
    alert('Your instruments have been saved !');
    onChangeForm('instruments', instruments);
  }

  function onEditPictureClick(_event: any) {
    onChangeForm('photo', croppedImg);
    setCroppedImg(null);
    setUpImg(null);
  }

  const handelCheckInstrument = useCallback(
    (key: string) => {
      const index = instrument_name_list.indexOf(key);
      checkList[index] = !checkList[index];
      setCheckList([...checkList]);
    },
    [checkList],
  );

  return (
    <div data-testid="ProfilePage" className="page-container">
      <div className="page-child">
        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
          🤗 Upload Your Profile 🤗
        </h3>
        <p className="mt-1 text-sm text-gray-600 text-center">
          Upload your profile to meet more musicians!
        </p>
        <div className="w-full p-5">
          <form className="shadow border overflow-hidden sm:rounded-md"></form>
        </div>

        <div className="profile-grid gap-2">
          <div className="px-4 py-2 font-semibold">📌 Name</div>
          <div className="px-4 py-2">{form.username}</div>
          <button
            data-testid="editnameButton"
            className="small-button"
            onClick={onEditNameClick}
          >
            Edit Your Name !
          </button>
          <div className="px-4 py-2 font-semibold">📌 Bio</div>
          <div className="px-4 py-2">{form.description}</div>
          <button
            data-testid="editBioButton"
            className="small-button"
            onClick={onEditBioClick}
          >
            Edit your Bio !
          </button>
          <div className="px-4 py-2 font-semibold">📌 Instruments</div>
          <div className="flex flex-wrap py-2">
            {instrument_name_list.map((value, index) => (
              <div
                key={`${value}_checkbox`}
                data-testid={`check${value}`}
                className="flex flex-row items-center px-4"
                onClick={() => handelCheckInstrument(value)}
              >
                <input
                  type="checkbox"
                  className="form-checkbox mr-2"
                  checked={checkList[index]}
                  readOnly
                />
                <div> {value} </div>
              </div>
            ))}
          </div>
          <button
            data-testid="chooseInstrument"
            className="small-button align-middle"
            onClick={onChooseInstruments}
          >
            Choose Instruments !
          </button>
          <div className="px-4 py-2 font-semibold">📷 Photo </div>
          <div>
            {croppedImg ? (
              <button
                data-testid="editprofileButton"
                className="small-button"
                onClick={onEditPictureClick}
              >
                Edit Profile Picture !
              </button>
            ) : photo ? (
              <img className="object-contain h-48 w-48" src={photo} alt="" />
            ) : null}
          </div>
          <div className="small-button align-middle">
            <div className="px-4 py-2 h-full">Select your Profile Picture</div>
            <input
              data-testid="uploadFile"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onSelectFile}
            />
          </div>
        </div>

        {upImg ? (
          <div data-testid="reactCrop" className="flex flex-row">
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => onCompleteCrop(c)}
            />
            <canvas
              ref={previewCanvasRef}
              style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </div>
        ) : null}

        <div className="w-full pt-4 flex flex-col items-center">
          <div className="mt-1 text-sm text-gray-600">
            If you're ready,please submit your changes !
          </div>
          <button
            id="editnameButton"
            className="small-button"
            onClick={onSaveClick}
          >
            ❗ Submit your Change ❗
          </button>
        </div>
      </div>
    </div>
  );
}
