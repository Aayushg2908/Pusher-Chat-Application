"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createMessage = async ({
  conversationId,
  image,
  message,
}: {
  message?: string;
  image?: string;
  conversationId: string;
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });
  if (!user) {
    return redirect("/sign-in");
  }

  const createdMessage = await db.message.create({
    data: {
      body: message,
      image: image,
      senderId: user.id,
      conversationId: conversationId,
    },
    include: {
      sender: true,
    },
  });

  pusherServer.trigger(conversationId, "new-message", createdMessage);

  revalidatePath(`/conversation/${conversationId}`);
};

export const getMessagesByConversationId = async (conversationId: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const messages = await db.message.findMany({
    where: {
      conversationId: conversationId,
    },
    include: {
      sender: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
};
