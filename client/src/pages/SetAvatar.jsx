import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import { Buffer } from 'buffer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoute';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    .loader {
    max-inline-size: 100%
    }
    .title {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            cursor: pointer;
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img {
                height: 6rem;

            }
        }
        .selected {
            border: 0.4rem solid #4e0eff;
        }

        
    }
        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transiftion: 0.5s ease-in-out;
            cursor: pointer;
            &:hover {
                background-color: #4e0eff;
            }
        

`

function SetAvatar() {

    const api = 'https://api.multiavatar.com/45678945'
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: 'bottom-right',
                autoClose: 8000,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark'
    }

    useEffect(() => {
        if(!localStorage.getItem("chat-app-user")) {
            navigate("/login")
        }
    }, [navigate])

    const setProfilePicture = async() => {
        if(selectedAvatar===undefined) {
            toast("Please select an avatar", toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"))

            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image:avatars[selectedAvatar]
            })
            
            if(data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;

                localStorage.setItem("chat-app-user", JSON.stringify(user));

                navigate("/")
            } else {
                toast("Error setting avatar, please try again", toastOptions)
            }
        }


    }

    useEffect(() => {
       async function generateImages() {
        try{
            const data = [];
            for(let i = 0; i < 4; i++) {
                // fetch image from api
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)

                // create buffer
                const buffer = Buffer.from(image.data);
                // Add to data array
                data.push(buffer.toString("base64"))
            }

            setAvatars(data);
            setIsLoading(false)
        }
        catch(err) {
            toast("Unable to get avatars, please wait 60 seconds and try again");
            console.log(err)
        }
            

            
        }

    generateImages();
        
    },[])
  return (
    <>
    {
        isLoading ? (
        <Container>
            <img src={loader} className='loader' />

        </Container>) : (
            <Container>
            <div className="title">
                <h1>Pick an avatar for your profile</h1>
            </div>
            <div className="avatars">
                {
                    avatars.map((item, index) => (
                        <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`} key={index}>
                            <img src={`data:image/svg+xml;base64,${item}`} alt="avatar" 
                            onClick={() => setSelectedAvatar(index)}
                            />
                        </div>
                    ))
                }
            </div>
            <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
        </Container>
        )
    }
    
    <ToastContainer />
    </>
  )
}

export default SetAvatar
