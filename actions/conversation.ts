"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
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
      isGroup: false,
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
    include: {
      users: true,
      messages: true,
    },
  });

  pusherServer.trigger("conversations", "new-conversation", conversation);

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
  if (!user) {
    return redirect("/sign-in");
  }

  const conversations = await db.conversation.findMany({
    where: {
      users: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      users: true,
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  revalidatePath("/");

  return conversations;
};

export const getConversationById = async (id: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const conversation = await db.conversation.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
      messages: true,
    },
  });

  return conversation;
};

export const createGroup = async ({
  name,
  users,
}: {
  name: string;
  users: string[];
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

  const conversation = await db.conversation.create({
    data: {
      name,
      isGroup: true,
      users: {
        connect: [
          {
            id: user.id,
          },
          ...users.map((id) => ({
            id,
          })),
        ],
      },
    },
    include: {
      users: true,
      messages: true,
    },
  });

  pusherServer.trigger("conversations", "new-conversation", conversation);

  revalidatePath("/");
  revalidatePath(`/conversation/${conversation.id}`);

  return conversation;
};
