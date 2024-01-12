"use client";

import { Message, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { MessageBox } from "./MessageBox";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  messages: (Message & { sender: User })[];
  user: User;
  conversation: string;
}

export const Messages = ({ messages, user, conversation }: MessagesProps) => {
  const [allMessages, setAllMessages] =
    useState<(Message & { sender: User })[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(conversation);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (message: Message & { sender: User }) => {
      setAllMessages((prev) => [...prev, message]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    pusherClient.bind("new-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(conversation);
      pusherClient.unbind("new-message", messageHandler);
    };
  }, [conversation, allMessages]);

  return (
    <div className="flex-1">
      {allMessages.map((message, i) => (
        <MessageBox key={message.id} data={message} user={user} />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};
