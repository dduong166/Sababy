const initialState = {
    detail: ""
};

export const productDetailReducer = (state = initialState, action) => {
    switch(action.type){
        case "SET_PRODUCT_DETAIL":
            return {
                ...state,
                detail: action.payload
            }
        default:
            return { ...state};
    }
}