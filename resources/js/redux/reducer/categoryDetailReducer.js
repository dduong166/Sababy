const initialState = {
    products: "",
    category_detail: "",
    categories: ""
};

export const categoryDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CATEGORY_DETAIL":
            const {products, category_detail} = action.payload;
            return {
                ...state,
                products: products,
                category_detail: category_detail
                
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
