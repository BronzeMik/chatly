import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoute';



const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items:center;
        gap: 1rem;
        justify-content: center;
        img {
            width: 100px;
        }
        h1 {
            color: white;
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #000000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus: {
            border: 0.1rem solid #997af0;
            outline: none;
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
        }
        span {
            color: white;
            text-transform: uppercase;
            a {
                &:hover {color: #4e0eff;}
                color: #b79dff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

function Login() {
    const navigate = useNavigate();

    // form values ref
    const [values, setValues] = useState({
        username: '',
        password: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        // front end validation
        if(handleValidation()){
            const {password, username} = values;
            const {data} = await axios.post(loginRoute, {
                username,
                password
            })

            // if registration fails
            if(data.status === false || data.status === 500) {
                toast(data.msg, toastOptions)
            }

            // if registration success
            if(data.status === true) {

                // pass user to local storage in JSON
                localStorage.setItem('chat-app-user', JSON.stringify(data.user))

                // navigate to chat page
                navigate("/");
            }
        }
        
    };

    useEffect(() => {
        if(localStorage.getItem("chat-app-user")) {
            navigate("/")
        }
    }, [navigate])

    const toastOptions = {
        position: 'bottom-right',
                autoClose: 8000,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark'
    }
    const handleValidation = () => {
        const {password, username} = values;
        // check password
        if(username === "" || password === "") {
            toast('Username and password is required', toastOptions);
            return false;
        }
        
        return true;
    }
    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues({...values, [name]:value})
    }
  return (
    
    <>
    <FormContainer>
        <form onSubmit={(event)=> handleSubmit(event)}>
            <div className="brand">
                <img src={logo} alt="logo" title="logo" />
                <h1>Chatly</h1>
            </div>
            {/* username */}
            <input 
            type="text" 
            placeholder='Username' 
            name="username" 
            onChange={e=>handleChange(e)} 
            />


            {/* password */}
            <input 
            type="password" 
            placeholder='Password' 
            name="password" 
            onChange={e=>handleChange(e)} 
            />

            
            
            <button
                type="submit"
                >Login</button>
                <span>Don't have an account? <Link to="/register">Register</Link></span>
        </form>
    </FormContainer>
    <ToastContainer />
    </>
  )
}



export default Login
