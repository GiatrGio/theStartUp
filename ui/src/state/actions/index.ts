import { bankActionType, userActionType } from "../action-types";
import { User } from "firebase/auth";

interface DepositAction {
  type: bankActionType.DEPOSIT;
  payload: number;
}

interface WithdrawAction {
  type: bankActionType.WITHDRAW;
  payload: number;
}

interface BankruptAction {
  type: bankActionType.BANKRUPT;
}

export type BankAction = DepositAction | WithdrawAction | BankruptAction;

interface LoginUser {
  type: userActionType.LOGIN;
  payload: User;
}

interface LogoutUser {
  type: userActionType.LOGOUT;
}

interface SignupUser {
  type: userActionType.SIGNUP;
  payload: User;
}

export type UserAction = LoginUser | LogoutUser | SignupUser;
