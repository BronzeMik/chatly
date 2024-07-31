import { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    img {
      height: 20rem;
    }
    span {
      color: #4e0eff;
    }`

export default function Welcome() {
    const [userName, setUserName] = useState("");


    useEffect(() => {
        async function checkUserName() {
            setUserName(
                await JSON.parse(
                  localStorage.getItem("chat-app-user")
                ).username
              );
        }
      checkUserName();
    }, []);
    return (
      <Container>
        <img src={Robot} alt="" />
        <h1>
          Welcome, <span>{userName}!</span>
        </h1>
        <h3>Please select a chat to Start messaging.</h3>
      </Container>
    );
  }
  
  
