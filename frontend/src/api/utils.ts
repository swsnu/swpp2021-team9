import { createAsyncAction } from 'typesafe-actions';

type AsyncActionType = {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
};

export const asyncActionCreator = (actionName: string): AsyncActionType => {
  const asyncTypeActions: string[] = ['_REQUEST', '_SUCCESS', '_FAILURE'];

  return {
    REQUEST: actionName + asyncTypeActions[0],
    SUCCESS: actionName + asyncTypeActions[1],
    FAILURE: actionName + asyncTypeActions[2],
  };
};

export const asyncAction = <T, P, J>(asyncAction: AsyncActionType) => {
  return createAsyncAction(
    asyncAction.REQUEST,
    asyncAction.SUCCESS,
    asyncAction.FAILURE,
  )<T, P, J>();
};
