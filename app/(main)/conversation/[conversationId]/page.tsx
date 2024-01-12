import React from "react";
import { Navbar } from "./_components/Navbar";
import { getConversationById } from "@/actions/conversation";
import { MessageInput } from "./_components/MessageInput";
import { notFound, redirect } from "next/navigation";
import { getMessagesByConversationId } from "@/actions/message";
import { Messages } from "./_components/Messages";
import { getUserByClerkId } from "@/actions/user";
import { auth } from "@clerk/nextjs";

const ConversationPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessagesByConversationId(params.conversationId);
  const user = await getUserByClerkId(userId);

  if (!conversation) return notFound();

  return (
    <>
      <Navbar conversation={conversation!} />
      <div className="h-full flex flex-col">
        <Messages
          messages={messages}
          user={user!}
          conversation={conversation.id}
        />
        <MessageInput conversationId={conversation.id} />
      </div>
    </>
  );
};

export default ConversationPage;
