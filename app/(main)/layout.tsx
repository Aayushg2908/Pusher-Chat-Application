import { getAllUsers } from "@/actions/user";
import { Sidebar } from "@/components/Sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getAllUsers();

  return (
    <div className="flex w-full h-full">
      <Sidebar users={users} />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
