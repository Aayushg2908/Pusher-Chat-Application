import { getAllConversations } from "@/actions/conversation";
import { getAllUsers } from "@/actions/user";
import { Sidebar } from "@/components/Sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getAllUsers();
  const conversations = await getAllConversations();

  return (
    <div className="flex w-full h-full">
      <Sidebar users={users} conversations={conversations} />
      <main className="flex-grow h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
