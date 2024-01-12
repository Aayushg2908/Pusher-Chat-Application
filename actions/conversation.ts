"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
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

  return conversation;
};
