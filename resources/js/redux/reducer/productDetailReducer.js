const {fromJS} = require('immutable');
const initialState = {
    detail: ""
};

export const productDetailReducer = (state = initialState, action) => {
    switch (action.type) {
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
            let draft = fromJS({...state});
            draft = draft.updateIn(['detail', 'questions', action.index, 'answers'], list => list.push(action.payload));
            console.log(draft.toJS());
            return draft.toJS();
                
        default:
            return { ...state };
    }
};
