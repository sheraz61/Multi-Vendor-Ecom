import axios from "axios";
import { server } from "../../server";

// load seller
export const loadSeller=()=> async(dispatch)=>{
    try {
        dispatch({
           type: "LoadSellerRequest",
        })
        const {data}= await axios.get(`${server}/shop/get-seller`,{
            withCredentials:true
        })
        dispatch({
            type:"LoadSellerSuccess",
            payload:data.seller,
        })
    } catch (error) {
        dispatch({
            type:"LoadSellerFail",
            payload:error.response.data.message
        })
    }
}