import React from "react";

type MessageInputProps = {
  onSend: (text: string) => void | Promise<void>;
};

function MessageInput({ onSend }: MessageInputProps) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Enter") {
      //   const input = event.currentTarget;
      //   const value = input.value.trim();
      //   if (!value) return;

      onSend(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="box">
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Say something..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default MessageInput;
