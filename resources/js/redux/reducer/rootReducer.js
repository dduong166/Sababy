import {combineReducers} from "redux";
import {AuthReducer} from "./authReducer";
import {productDetailReducer} from "./productDetailReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    productDetail: productDetailReducer
});

export default rootReducer;