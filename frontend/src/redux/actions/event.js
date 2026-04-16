import axios from "axios";
import { server } from "../../server";

// create event
export const createEvent=(data)=> async(dispatch)=>{
    try {
       
        const {data:res}= await axios.post(`${server}/event/create-event`,
            data,
            
        )
        dispatch({
            type:"eventCreateSuccess",
            payload:res.event,
        })
    } catch (error) {
        dispatch({
            type:"eventCreateFail",
            payload:error.response.data.message
        })
    }
}

export const getAllEventsShop=(id)=> async(dispatch)=>{
    try {
        dispatch({
           type: "getAllEventsShopRequest",
        })
       
        const {data}= await axios.get(`${server}/event/get-all-events/${id}`,
          
        )
        dispatch({
            type:"getAllEventsShopSuccess",
            payload:data.events,
        })
    } catch (error) {
          dispatch({
            type:"getAllEventsShopFail",
            payload:error.response.data.message
        })
    }
}

//delete event of a shop
export const deleteEvent=(id)=> async(dispatch)=>{
    try {
        dispatch({
           type: "deleteEventRequest",
        })
       
        const {data}= await axios.delete(`${server}/event/delete-shop-event/${id}`,{withCredentials:true}
        )
        dispatch({
            type:"deleteEventSuccess",
            payload:data.message,
        })
    } catch (error) {
          dispatch({
            type:"deleteEventFail",
            payload:error.response.data.message
        })
    }
}

export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAllEventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAllEventsFailed",
      payload: error.response.data.message || error.message,
    });
  }
};