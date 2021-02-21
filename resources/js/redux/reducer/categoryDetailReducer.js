const initialState = {
    detail: "",
    categories: ""
};

export const categoryDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CATEGORY_DETAIL":
            return {
                ...state,
                detail: action.payload
            };
        case "SET_CATEGORIES":
            return {
                ...state,
                categories: action.payload
            };
        default:
            return { ...state };
    }
};
