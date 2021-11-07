import React, { useState } from 'react';

export type Props = {};

export default function CreateSongPage(props: Props) {
  const [Form, setForm] = useState({
    title: '',
    singer: '',
    category: '',
    reference: '',
    description: '',
  });

  const categories = ['Pop', 'Rock', 'Hip-hop', 'Jazz'];

  const onChangeForm = (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    key: string,
  ) => {
    setForm({ ...Form, [key]: e.currentTarget.value });
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    console.log(e);
  };

  const submitDisabled = () => {
    return !!(Form.title === '' || Form.singer === '' || Form.reference === '');
  };

  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    input:
      'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
  };

  return (
    <div data-testid="CreateSongPage" className="flex flex-col items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Upload Song
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Upload a song link for covers!
      </p>

      <div className="w-full sm:w-3/4 m-5">
        <form
          onSubmit={onSubmitForm}
          className="shadow border overflow-hidden sm:rounded-md"
        >
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="title" className={styles.label}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={Form.title}
                  onChange={e => onChangeForm(e, 'title')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="singer" className={styles.label}>
                  Singer
                </label>
                <input
                  type="text"
                  name="singer"
                  value={Form.singer}
                  onChange={e => onChangeForm(e, 'singer')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="category" className={styles.label}>
                  Category
                </label>
                <select
                  name="category"
                  value={Form.category}
                  onChange={e => onChangeForm(e, 'category')}
                  className="mt-1 block w-full py-1 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {categories.map(item => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="reference" className={styles.label}>
                  Reference Link
                </label>
                <input
                  type="text"
                  name="reference"
                  value={Form.reference}
                  onChange={e => onChangeForm(e, 'reference')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={Form.description}
                  onChange={e => onChangeForm(e, 'description')}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={submitDisabled()}
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
