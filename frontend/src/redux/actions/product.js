import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct = (name,
    description,
    category,
    tags,
    originalPrice,
    discountPrice,
    stock,
    shopId,
    images) => async (dispatch) => {
        try {
            dispatch({
                type: "productCreateRequest",
            })

            const { data } = await axios.post(`${server}/product/create-product`,
                name,
                description,
                category,
                tags,
                originalPrice,
                discountPrice,
                stock,
                shopId,
                images,

            )
            dispatch({
                type: "productCreateSuccess",
                payload: data.product,
            })
        } catch (error) {
            dispatch({
                type: "productCreateFail",
                payload: error.response.data.message
            })
        }
    }

export const getAllProductsShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductsShopRequest",
        })

        const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`,

        )
        dispatch({
            type: "getAllProductsShopSuccess",
            payload: data.products,
        })
    } catch (error) {
        dispatch({
            type: "getAllProductsShopFail",
            payload: error.response.data.message
        })
    }
}

//delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteProductRequest",
        })

        const { data } = await axios.delete(`${server}/product/delete-shop-product/${id}`, { withCredentials: true }
        )
        dispatch({
            type: "deleteProductSuccess",
            payload: data.message,
        })
    } catch (error) {
        dispatch({
            type: "deleteProductFail",
            payload: error.response.data.message
        })
    }
}

// get all products
export const getAllProducts = () => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductRequests",
        });

        const { data } = await axios.get(`${server}/product/get-all-products`);
        dispatch({
            type: "getAllProductSuccess",
            payload: data.products,
        });
    } catch (error) {
        dispatch({
            type: "getAllProductsFailed",
            payload: error.response.data.message,
        });
    }
};