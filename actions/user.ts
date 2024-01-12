"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const getAllUsers = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const users = await db.user.findMany({
    where: {
      NOT: {
        clerkId: userId,
      },
    },
  });

  return users;
};

export const getUserByClerkId = async (clerkId: string) => {
  const user = await db.user.findUnique({
    where: {
      clerkId: clerkId,
    },
  });

  return user;
};
