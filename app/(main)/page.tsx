import { getAllConversations } from "@/actions/conversation";
import { getAllUsers } from "@/actions/user";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MobileNav } from "./conversation/[conversationId]/_components/MobileNav";

export default async function Home() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const conversations = await getAllConversations();
  const users = await getAllUsers();

  const conversation = await db.conversation.findFirst({
    where: {
      users: {
        some: {
          clerkId: userId,
        },
      },
    },
  });
  if (conversation) {
    return redirect(`/conversation/${conversation.id}`);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 font-bold text-2xl">
      Select a chat or start a new conversation
      <div className="md:hidden">
        <MobileNav conversations={conversations} users={users} />
      </div>
    </div>
  );
}
