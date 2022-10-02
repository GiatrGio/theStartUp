import { BankAction } from "../actions";
import { bankActionType } from "../action-types";

const initialState = 0;

const bankReducer = (state: number = initialState, action: BankAction) => {
  switch (action.type) {
    case bankActionType.DEPOSIT:
      console.log("state ", state);
      return state + action.payload;
    case bankActionType.WITHDRAW:
      return state - action.payload;
    case bankActionType.BANKRUPT:
      return 0;
    default:
      return state;
  }
};

export default bankReducer;
