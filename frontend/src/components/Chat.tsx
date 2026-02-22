//import React from "react";
import { useNavigate } from "react-router-dom";
import ChatNavBar from "./ChatNavBar.tsx";
import MessageInput from "./MessageInput.tsx";
import MessageList from "./MessageList.tsx";
import { useMessages, useAddMessage } from "../lib/graphql/hooks/hook";

import "../navbar.css";

type User = {
  id: string;
  name: string;
};

type ChatProps = {
  user: User;
};

//const Chat: React.FC<ChatProps> = ({ user }: ChatProps)
const Chat = ({ user }: ChatProps) => {
  const navigate = useNavigate();

  const { messages } = useMessages();
  const { addMessage } = useAddMessage();

  //   const { messages } = useMessages() as {
  //     messages: Array<any>; // Replace `any` with your Message type if available
  //   };

  //   const { addMessage } = useAddMessage() as {
  //     addMessage: (text: string) => Promise<any>; // Replace `any` with your Message type
  //   };

  const handleSend = async (text: string): Promise<void> => {
    const message = await addMessage(text);
    console.log("Message added:", message);
  };

  const handleBack = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <ChatNavBar />
      <section className="section">
        <div className="container">
          <h1 className="title is-4">{`Chatting as ${user.name}`}</h1>
          <MessageList user={user} messages={messages} />
          <MessageInput onSend={handleSend} />
          <button
            className="button is-link button-centered"
            onClick={handleBack}
          >
            ← Back
          </button>
        </div>
      </section>
    </>
  );
};

export default Chat;
