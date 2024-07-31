import {useState, useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom"
import styled from "styled-components";
import axios from 'axios';
import { allUsersRoute, host } from '../utils/APIRoute';
import Contacts from '../_components/Contacts';
import Welcome from '../_components/Welcome';
import ChatContainer from '../_components/ChatContainer';
import Loader from "../assets/loader.gif";
import {io} from "socket.io-client";





const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`

function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    // check if user is logged in
    useEffect(() => {
      async function getCurrentUser() {
        
        if(!localStorage.getItem("chat-app-user")) {
          navigate("/login")
        } else {

          // set current user
          setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
          
        }

      }
      getCurrentUser();
        
    }, [navigate])


    useEffect(() => {
      async function getNewMessages() {
        if(currentUser) {
          socket.current = io(host);

          socket.current.emit("add-user", currentUser._id)
        }
      };

      getNewMessages();
    }, [currentUser])

    // get all users
    useEffect(() => {
      async function getUsers(currUser) {
        if(currentUser) {
          if(currentUser.isAvatarImageSet) {

            // get all users route
            const {data} = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            
            setContacts(data);
            setIsLoaded(true);
          } else {
            // if no avatar, navigate to setAvatar
            navigate("/setAvatar");
          }
        }
      }

      getUsers(currentUser)
    }, [currentUser])




    const handleChatChange = (chat) => {
      setCurrentChat(chat)
    }


  return (
    <Container>
      {
        !isLoaded ? (<><img src={Loader} alt="loading" /></>) :
        (
          <div className="container">
        {contacts && <Contacts contacts={contacts} changeChat={handleChatChange}/>}
        {!currentChat ? <Welcome /> : 
        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>}
        </div>
        )
      }
      
    </Container>
  )
}

export default Chat
