import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { server } from '../server'

const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    useEffect(() => {
        if (activation_token) {
          const sendRequest = async () => {
            await axios
              .post(`${server}/shop/activation`, {
                activation_token,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                setError(true);
              });
          };
          sendRequest();
        }
      }, []);
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
                <p>your token is expired!</p>
            ) : (
                <p>Your shop has been activated suceessfully!</p>
            )}
        </div>
    )
}

export default SellerActivationPage
