import { Dispatch } from "redux";
import { bankActionType, userActionType } from "../action-types";
import { BankAction, UserAction } from "../actions";
import { User } from "firebase/auth";

export const depositMoney = (amount: number) => {
  return (dispatch: Dispatch<BankAction>) => {
    dispatch({
      type: bankActionType.DEPOSIT,
      payload: amount,
    });
  };
};

export const withdrawMoney = (amount: number) => {
  return (dispatch: Dispatch<BankAction>) => {
    dispatch({
      type: bankActionType.WITHDRAW,
      payload: amount,
    });
  };
};

export const bankrupt = () => {
  return (dispatch: Dispatch<BankAction>) => {
    dispatch({
      type: bankActionType.BANKRUPT,
    });
  };
};

export const loginUser = (user: User) => {
  return (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: userActionType.LOGIN,
      payload: user,
    });
  };
};

export const signupUser = (user: User) => {
  return (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: userActionType.SIGNUP,
      payload: user,
    });
  };
};

export const logoutUser = () => {
  return (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: userActionType.LOGOUT,
    });
  };
};
