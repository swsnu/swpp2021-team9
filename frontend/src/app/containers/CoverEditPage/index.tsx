import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useCoverEdit } from './hook';

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

const styles = {
  label: 'block text-xl font-medium text-gray-700',
  input:
    'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-m border-gray-300 rounded-md',
  tag: 'mr-3 text-m font-medium cursor-pointer',
  select:
    'mt-1 block w-full py-1 border-gray-300 bg-white rounded-md shadow-m focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
  submitButton:
    'py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
};

interface InputLineProps extends React.InputHTMLAttributes<HTMLInputElement> {
  head: string;
  tag: string;
  value: string;
  children?: React.ReactNode;
}

const InputLine = ({
  head,
  tag,
  value,
  children,
  ...inputOptions
}: InputLineProps) => {
  return (
    <div className="col-span-6">
      <div data-testid={`${tag}_head`} className={styles.label}>
        {head}
      </div>
      {children}
      <input
        data-testid={`input_${tag}`}
        type={tag}
        name={tag}
        value={value}
        className={styles.input}
        {...inputOptions}
      />
    </div>
  );
};

export default function CoverEditPage(props: Props) {
  const {
    onChangeForm,
    onKeyPress,
    onSubmitForm,
    onTagClicked,
    submitDisabled,
    form,
    tagInput,
    setTagInput,
  } = useCoverEdit(props);

  return (
    <div data-testid="CoverEditPage" className="flex flex-col items-center">
      <h3 className="text-3xl font-semibold leading-6 text-gray-900">
        Edit Cover Details
      </h3>

      <form
        data-testid="form"
        onSubmit={onSubmitForm}
        className="shadow border overflow-hidden sm:rounded-md w-full sm:w-3/4 max-w-screen-md m-5"
      >
        <div className="px-4 py-5 grid grid-cols-6 gap-6">
          <InputLine
            head="Title"
            tag="title"
            value={form.title}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              onChangeForm(e, 'title')
            }
          />
          <InputLine
            head="Tags (optional)"
            tag="tags"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Click tag to remove. Enter to Add"
          >
            <div className="flex flex-row flex-wrap">
              {form.tags.map(tag => (
                <div
                  id={'tags_button'}
                  key={`tags_${tag}`}
                  className={styles.tag}
                  onClick={() => onTagClicked(tag)}
                >
                  {`#${tag}`}
                </div>
              ))}
            </div>
          </InputLine>

          <div className="col-span-6">
            <label htmlFor="description" className={styles.label}>
              Description (optional)
            </label>
            <textarea
              data-testid="textarea_description"
              name="description"
              id="description"
              rows={5}
              value={form.description}
              onChange={e => onChangeForm(e as any, 'description')}
              className={styles.input}
            />
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            data-testid="submit-btn"
            type="submit"
            disabled={submitDisabled}
            className={styles.submitButton}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
