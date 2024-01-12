import { getAllConversations } from "@/actions/conversation";
import { getAllUsers } from "@/actions/user";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getAllUsers();
  const conversations = await getAllConversations();

  return (
    <div className="flex w-full h-full">
      <Sidebar users={users} conversations={conversations} />
      <main className="flex-grow h-full overflow-y-auto custom-scrollbar">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
