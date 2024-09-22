import {combineReducers,legacy_createStore,applyMiddleware} from "redux";
import {thunk} from "redux-thunk";
import { contactReducer } from "./reducers/contactReducer";

const reducers = combineReducers({
contactReducer
});

export const store = legacy_createStore(reducers,applyMiddleware(thunk));