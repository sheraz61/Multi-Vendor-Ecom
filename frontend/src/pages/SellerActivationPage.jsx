import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { server } from '../server'

const SellerActivationPage = () => {
    const { activation_token } = useParams()
    const [error, setError] = useState(false)
    const hasRequestedRef = useRef(false)
    useEffect(() => {
        if (activation_token) {
            // React 18 StrictMode runs effects twice in dev; prevent duplicate POST.
            if (hasRequestedRef.current) return
            hasRequestedRef.current = true

            const sendRequest = async () => {
                try {
                    // console.log('activation request sending');
                    const res = await axios.post(`${server}/shop/activation`, { activation_token });
                    console.log('Activation response:', res.data);
                    
                    // Check if the response indicates success
                    if (res.data.success === false) {
                        console.error("Activation failed:", res.data.message);
                        setError(true);
                    } else {
                        console.log("Shop activated successfully!");
                    }
                } catch (err) {
                    console.log("Activation error:", err);
                    console.log("Error response:", err.response?.data);
                    setError(true);
                }
            }
            sendRequest();
        }
    }, [activation_token])
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {error ? (
                <p>Your token is expired!</p>
            ) : (
                <p>Your account has been created suceessfully!</p>
            )}
        </div>
    )
}

export default SellerActivationPage
