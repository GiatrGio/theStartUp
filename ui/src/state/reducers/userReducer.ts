import { User } from "firebase/auth";
import { userActionType } from "../action-types";
import { UserAction } from "../actions";

export type UserState = User | null;
const initialState = null;

const userReducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case userActionType.LOGIN:
      return action.payload;
    case userActionType.LOGOUT:
      return null;
    case userActionType.SIGNUP:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
