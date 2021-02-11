const initialState = {
    currentUser: ""
};

export const AuthReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGOUT":
            return {
                ...state,
                currentUser: ""
            };
        case "LOGIN":
            return {
                ...state,
                currentUser: action.payload
            }
        default:
            return { ...state};
    }
}