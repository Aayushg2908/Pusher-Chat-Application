"use client";

import { cn } from "@/lib/utils";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { Users2Icon, MessageCircleMore, LogOut } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Conversation, Message, User } from "@prisma/client";
import Image from "next/image";
import { createConversation } from "@/actions/conversation";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Group } from "lucide-react";
import { useCreateGroupModal } from "@/hooks/use-creategroup-modal";
import { AvatarGroup } from "./AvatarGroup";
import { pusherClient } from "@/lib/pusher";

export const Sidebar = ({
  users,
  conversations,
}: {
  users: User[];
  conversations: (Conversation & {
    users: User[];
    messages: Message[];
  })[];
}) => {
  const [allConversations, setAllConversations] = useState<
    (Conversation & {
      users: User[];
      messages: Message[];
    })[]
  >(conversations);
  const { user: clerkUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useCreateGroupModal();

  useEffect(() => {
    pusherClient.subscribe("conversations");

    const conversationHandler = (
      conversation: Conversation & {
        users: User[];
        messages: Message[];
      }
    ) => {
      setAllConversations((prev) => [...prev, conversation]);
    };

    pusherClient.bind("new-conversation", conversationHandler);

    return () => {
      pusherClient.unsubscribe("conversations");
      pusherClient.unbind("new-conversation", conversationHandler);
    };
  }, [conversations]);

  const isUsers = pathname === "/users";

  const isConversationActive = (id: string) => {
    if (params.conversationId) {
      return params.conversationId === id;
    }
    return false;
  };

  const handleClick = async (id: string) => {
    try {
      const conversation = await createConversation({ userId: id });
      router.push(`/conversation/${conversation.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="z-30 h-screen sticky left-0 top-0 hidden md:flex w-[350px] border border-r">
      <div className="max-sm:hidden h-full w-[70px] flex flex-col items-center justify-between p-2 border border-r">
        <div className="w-full flex flex-col items-center gap-y-4 mt-4 text-gray-600">
          <Link
            className={cn("p-3 rounded-xl", !isUsers && "bg-slate-200")}
            href="/"
          >
            <MessageCircleMore className="w-7 h-7" />
          </Link>
          <Link
            className={cn("p-3 rounded-xl", isUsers && "bg-slate-200")}
            href="/users"
          >
            <Users2Icon className="w-7 h-7" />
          </Link>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <Button variant="ghost" size="icon">
              <LogOut className="w-7 h-7" />
            </Button>
          </SignOutButton>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      {!isUsers && (
        <div className="overflow-y-auto custom-scrollbar w-full flex flex-col p-2">
          <div className="w-full flex items-center justify-between mt-4 mb-8 ml-1">
            <h1 className="font-bold text-xl">Messages</h1>
            <Button onClick={() => onOpen(users)} variant="ghost" size="icon">
              <Group />
            </Button>
          </div>
          {allConversations.length > 0 ? (
            <div className="flex flex-col gap-y-2">
              {allConversations.map((conversation) => {
                const lastMessage = () => {
                  const messages = conversation.messages || [];
                  return messages[messages.length - 1];
                };

                const lastMessageText = () => {
                  if (lastMessage()?.image) {
                    return "Sent an Image";
                  }
                  if (lastMessage()?.body) {
                    return lastMessage()?.body;
                  }
                  return "Started a conversation";
                };

                return (
                  <Link
                    key={conversation.id}
                    href={`/conversation/${conversation.id}`}
                    className={cn(
                      "flex gap-x-2 items-center mr-1 w-full p-2 rounded-xl",
                      isConversationActive(conversation.id) && "bg-slate-100"
                    )}
                  >
                    {conversation.isGroup ? (
                      <AvatarGroup users={conversation.users} />
                    ) : (
                      <Image
                        src={
                          conversation.users.filter(
                            (user) => user.clerkId !== clerkUser?.id
                          )[0].image
                        }
                        alt="logo"
                        width={20}
                        height={20}
                        className="rounded-full w-10 h-10"
                      />
                    )}
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="w-full flex justify-between items-center">
                        {conversation.isGroup ? (
                          <p className="font-bold text-lg">
                            {conversation.name}
                          </p>
                        ) : (
                          <p className="font-bold text-lg">
                            {
                              conversation.users.filter(
                                (user) => user.clerkId !== clerkUser?.id
                              )[0].username
                            }
                          </p>
                        )}
                        {lastMessage()?.createdAt && (
                          <p className="mr-2 text-sm">
                            {format(new Date(lastMessage().createdAt), "p")}
                          </p>
                        )}
                      </div>
                      <div className="line-clamp-1">{lastMessageText()}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="font-bold text-lg">No Conversations Found</div>
          )}
        </div>
      )}
      {isUsers && (
        <div className="overflow-y-auto custom-scrollbar w-full flex flex-col gap-y-8 p-2">
          <h1 className="font-bold text-2xl mt-4 ml-1">People</h1>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleClick(user.id)}
              className="flex items-center gap-x-2 cursor-pointer ml-1"
            >
              <Image
                src={user.image}
                alt="userLogo"
                width={20}
                height={20}
                className="rounded-full w-10 h-10"
              />
              <p className="font-bold text-lg">{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
