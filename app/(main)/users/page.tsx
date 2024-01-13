import { getAllConversations } from "@/actions/conversation";
import { getAllUsers } from "@/actions/user";
import { MobileNav } from "../conversation/[conversationId]/_components/MobileNav";

const UsersPage = async () => {
  const conversations = await getAllConversations();
  const users = await getAllUsers();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 font-bold text-2xl">
      Select a chat or start a new conversation
      <div className="md:hidden">
        <MobileNav conversations={conversations} users={users} />
      </div>
    </div>
  );
};

export default UsersPage;
