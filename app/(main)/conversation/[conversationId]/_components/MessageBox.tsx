"use client";

import { cn } from "@/lib/utils";
import { Message, User } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { deleteMessage } from "@/actions/message";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

export const MessageBox = ({
  data,
  user,
  conversationId,
}: {
  data: Message & { sender: User };
  user: User;
  conversationId: string;
}) => {
  const [message, setMessage] = useState<Message & { sender: User }>(data);
  const isOwn = message.senderId === user.id;

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const deleteHandler = (updatedMessage: Message & { sender: User }) => {
      console.log(updatedMessage);
      if (updatedMessage.id === message.id) {
        setMessage(updatedMessage);
      }
    };

    pusherClient.bind("message-deleted", deleteHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message-deleted", deleteHandler);
    };
  }, [data.id, conversationId]);

  const handleClick = async () => {
    try {
      await deleteMessage(message.id, conversationId);
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={cn("flex gap-3 p-4", isOwn && "justify-end")}>
      <div className={cn(isOwn && "order-2")}>
        <Image
          src={message.sender.image}
          alt="profile"
          width={20}
          height={20}
          className="rounded-full w-10 h-10"
        />
      </div>
      <div className={cn("flex flex-col gap-2", isOwn && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message.sender.username}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>
        <div
          className={cn(
            "text-sm w-fit overflow-hidden flex items-center",
            isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
            message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
          )}
        >
          {message.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              src={message.image}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>
              {message.isDeleted ? (
                <div className="bg-red-500 p-1 rounded-xl text-white">
                  This message was deleted
                </div>
              ) : (
                <div>{message.body}</div>
              )}
            </div>
          )}
          {isOwn && !message.isDeleted && (
            <Trash2
              onClick={handleClick}
              className="ml-3 w-4 h-4 cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};
