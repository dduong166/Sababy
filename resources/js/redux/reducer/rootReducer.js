import {combineReducers} from "redux";
import {AuthReducer} from "./authReducer";
import {productDetailReducer} from "./productDetailReducer";
import {categoryDetailReducer} from "./categoryDetailReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    productDetail: productDetailReducer,
    categoryDetail: categoryDetailReducer
});

export default rootReducer;