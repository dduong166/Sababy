const {fromJS} = require('immutable');
const initialState = {
    detail: "",
    products: ""
};

export const productDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PRODUCTS":
            return {
                ...state,
                products: action.payload
            };
        case "SET_PRODUCT_DETAIL":
            return {
                ...state,
                detail: action.payload
            };
        case "SET_PRODUCT_QUESTION":
            return {
                ...state,
                detail: {
                    ...state.detail,
                    questions: [action.payload, ...state.detail.questions]
                }
            };
        case "SET_PRODUCT_ANSWER":
            let index = action.payload.index;
            let draft = fromJS({...state});
            draft = draft.updateIn(['detail', 'questions', index, 'answers'], list => list.push(action.payload));
            console.log(draft.toJS());
            return draft.toJS();
                
        default:
            return { ...state };
    }
};
