const initialState = {
    currentUser: "",
    loading: true 
};

export const AuthReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGOUT":
            return {
                ...state,
                currentUser: "",
                loading: false
            };
        case "LOGIN":
            return {
                ...state,
                currentUser: action.payload,
                loading: false
            }
        default:
            return { ...state};
    }
}