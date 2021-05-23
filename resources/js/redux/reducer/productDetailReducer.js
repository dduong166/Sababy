const { fromJS, removeIn } = require("immutable");
const initialState = {
    detail: "",
    products: "",
    sold_products: ""
};

export const productDetailReducer = (state = initialState, action) => {
    var index = null;
    var draft = null;
    var id = null;
    var move_product = null;
    switch (action.type) {
        case "SET_PRODUCTS":
            return {
                ...state,
                products: action.payload
            };
        case "SET_SOLD_PRODUCTS":
            return {
                ...state,
                sold_products: action.payload
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
            index = action.payload.index;
            draft = fromJS({ ...state });
            draft = draft.updateIn(
                ["detail", "questions", index, "answers"],
                list => list.push(action.payload)
            );
            return draft.toJS();
        case "SET_BOOKMARK":
            index = action.index;
            draft = fromJS({ ...state });
            draft = draft.updateIn(["products", index, "bookmarks"], list =>
                list.push(action.payload)
            );
            console.log("set bm");
            return draft.toJS();
        case "SET_UNBOOKMARK":
            index = action.index;
            draft = fromJS({ ...state });
            draft = removeIn(draft, ["products", index, "bookmarks", 0]);
            console.log("set unbm");
            return draft.toJS();
        case "CHANGE_TO_SOLD_STATUS":
            id = Number(action.payload);
            const products = state.products.filter(product => {
                if(product.id === id) {
                    move_product = product;
                }
                return product.id !== id;
            });
            return {
                ...state,
                products: products,
                sold_products: [...state.sold_products, move_product]
            };
        case "CHANGE_TO_SELLING_STATUS":
            id = Number(action.payload);
            const sold_products = state.sold_products.filter(sold_product => {
                if(sold_product.id === id) {
                    move_product = sold_product;
                }
                return sold_product.id !== id;
            });
            return {
                ...state,
                products: [...state.products, move_product],
                sold_products: sold_products
            };

        default:
            return { ...state };
    }
};
