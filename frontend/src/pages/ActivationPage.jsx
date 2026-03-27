import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { server } from '../server'
const ActivationPage = () => {
    const { activation_token } = useParams()
    const [error, setError] = useState(false)
    useEffect(() => {
        if (activation_token) {
            const sendRequest = async () => {
                try {
                    console.log('activation request sending');
                    const res = await axios.post(`${server}/user/activation`, { activation_token });
                    console.log('Activation response:', res.data);
                    
                    // Check if the response indicates success
                    if (res.data.success === false) {
                        console.error("Activation failed:", res.data.message);
                        setError(true);
                    } else {
                        console.log("Account activated successfully!");
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

export default ActivationPage
