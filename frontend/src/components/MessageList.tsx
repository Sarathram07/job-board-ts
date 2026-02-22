import { useEffect, useRef } from "react";

// Define Message type
export interface Message {
  id: string;
  user: string; // or userId if you use IDs
  text: string;
  createdAt?: string; // optional
}

// User type
export interface User {
  id: string;
  name: string;
}

// Props for MessageList
interface MessageListProps {
  user: User;
  messages: Message[];
}

function MessageList({ user, messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null); // type the ref

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // scroll to bottom to make the last message visible
      container.scrollTo(0, container.scrollHeight);
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="box"
      style={{ height: "50vh", overflowY: "scroll" }}
    >
      <table>
        <tbody>
          {messages.map((message) => (
            <MessageRow key={message.id} user={user} message={message} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Props for MessageRow
interface MessageRowProps {
  user: User;
  message: Message;
}

function MessageRow({ user, message }: MessageRowProps) {
  return (
    <tr>
      <td className="py-1">
        <span className={message.user === user.name ? "tag is-primary" : "tag"}>
          {message.user}
        </span>
      </td>
      <td className="pl-4 py-1">{message.text}</td>
    </tr>
  );
}

export default MessageList;
