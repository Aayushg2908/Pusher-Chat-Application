"use client";

import { Message, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { MessageBox } from "./MessageBox";

interface MessagesProps {
  messages: (Message & { sender: User })[];
  user: User;
}

export const Messages = ({ messages, user }: MessagesProps) => {
  const [allMessages, setAllMessages] =
    useState<(Message & { sender: User })[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1">
      {allMessages.map((message, i) => (
        <MessageBox key={message.id} data={message} user={user} />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};
