const initialState = {
    detail: ""
};

export const categoryDetailReducer = (state = initialState, action) => {
    switch(action.type){
        case "SET_CATEGORY_DETAIL":
            return {
                ...state,
                detail: action.payload
            }
        default:
            return { ...state};
    }
}