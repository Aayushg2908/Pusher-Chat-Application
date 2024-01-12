"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createConversation = async ({ userId }: { userId: string }) => {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: clerkId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const existingConversation = await db.conversation.findFirst({
    where: {
      AND: [
        {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        {
          users: {
            some: {
              id: userId,
            },
          },
        },
      ],
    },
  });
  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await db.conversation.create({
    data: {
      users: {
        connect: [
          {
            id: user.id,
          },
          {
            id: userId,
          },
        ],
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/conversation/${conversation.id}`);

  return conversation;
};

export const getAllConversations = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const conversations = await db.conversation.findMany({
    where: {
      users: {
        some: {
          id: user?.id,
        },
      },
    },
    include: {
      users: true,
    },
  });

  revalidatePath("/");

  return conversations;
};
