import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Song, CreateCover } from 'utils/urls';
import { useDispatch } from 'react-redux';
import { useCreateCoverSlice } from './slice';

export type Props = {};

export interface CoverForm {
  title: string;
  category: string;
  tags: string[];
  instrumentType: string;
  description: string;
}

const initialForm: CoverForm = {
  title: '',
  category: '0',
  tags: [],
  instrumentType: '',
  description: '',
};

export default function CreateCoverInfoPage(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useCreateCoverSlice();

  const [Form, setForm] = useState(initialForm);
  const [tagInput, setTagInput] = useState<string>('');

  const categories = ['Pop', 'Rock', 'Hip-hop', 'Jazz'];

  const onChangeForm = (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    key: string,
  ) => {
    setForm({ ...Form, [key]: e.currentTarget.value });
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && e.code === 'Enter') {
      console.log(e);
      e.preventDefault();
      setForm({ ...Form, tags: [...Form.tags, tagInput] });
      setTagInput('');
    }
  };

  const onPrevClicked = e => {
    history.replace(CreateCover('record'));
  };

  const onSubmitForm = (
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const isFinish = window.confirm('커버 정보를 업로드 하시겠습니까?');
    if (!isFinish) {
      return;
    }
    console.log(Form);
    dispatch(actions.setInfo(Form));
    history.push(Song(0));
  };

  const submitDisabled = () => {
    return (
      Form.title === '' || Form.category === '' || Form.instrumentType === ''
    );
  };

  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    input:
      'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
    tag: 'text-sm font-medium',
  };

  return (
    <div
      data-testid="CreateCoverInfoPage"
      className="flex flex-col items-center"
    >
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Cover's Detail Information.
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Please write down the details of the recorded or uploaded cover song.
      </p>

      <div className="w-full sm:w-3/4 max-w-screen-md m-5">
        <form
          data-testid="form"
          onSubmit={onSubmitForm}
          className="shadow border overflow-hidden sm:rounded-md"
        >
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="title" className={styles.label}>
                  Title
                </label>
                <input
                  data-testid="title"
                  type="text"
                  name="title"
                  id="title"
                  value={Form.title}
                  onChange={e => onChangeForm(e, 'title')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="category" className={styles.label}>
                  Category
                </label>
                <select
                  data-testid="select"
                  name="category"
                  id="category"
                  value={Form.category}
                  onChange={e => onChangeForm(e, 'category')}
                  className="mt-1 block w-full py-1 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {categories.map((item, index) => (
                    <option value={index} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="reference" className={styles.label}>
                  Instrument Type
                </label>
                <input
                  data-testid="instrument"
                  type="text"
                  name="instrumentType"
                  id="instrumentType"
                  value={Form.instrumentType}
                  onChange={e => onChangeForm(e, 'instrumentType')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="tags" className={styles.label}>
                  Tags (optional)
                </label>
                <p className={styles.tag}>
                  {Form.tags.map(tag => {
                    return `#${tag} `;
                  })}
                </p>
                <input
                  data-testid="tag-input"
                  type="text"
                  name="tagInput"
                  id="tagInput"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className={styles.label}>
                  Description (optional)
                </label>
                <textarea
                  data-testid="description"
                  name="description"
                  id="description"
                  rows={5}
                  value={Form.description}
                  onChange={e => onChangeForm(e, 'description')}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 flex flex-row w-full lg:space-x-96 md:space-x-48 sm:space-x-20 justify-center">
            <button
              data-testid="cancel-btn"
              type="button"
              onClick={e => onPrevClicked(e)}
              className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
            >
              Previous
            </button>
            <button
              data-testid="submit-btn"
              type="submit"
              disabled={submitDisabled()}
              onClick={e => onSubmitForm(e)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
