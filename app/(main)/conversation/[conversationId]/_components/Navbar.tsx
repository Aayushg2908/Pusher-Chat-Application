import { AvatarGroup } from "@/components/AvatarGroup";
import { auth } from "@clerk/nextjs";
import { Conversation, Message, User } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { MobileNav } from "./MobileNav";

interface NavbarProps {
  users: User[];
  conversation: Conversation & { users: User[]; messages: Message[] };
  conversations: (Conversation & { users: User[]; messages: Message[] })[];
}

export const Navbar = ({ conversation, users, conversations }: NavbarProps) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <nav className="w-full sticky top-0 bg-white h-[70px] border border-l-0 border-b">
      <div className="h-full flex justify-between items-center">
        <div className="h-full flex items-center gap-x-2">
          <div className="md:hidden mx-2">
            <MobileNav users={users} conversations={conversations} />
          </div>
          {conversation.isGroup ? (
            <div className="mx-2">
              <AvatarGroup users={conversation.users} />
            </div>
          ) : (
            <Image
              src={
                conversation.users.filter((user) => user.clerkId !== userId)[0]
                  .image
              }
              alt="profile"
              width={20}
              height={20}
              className="w-10 h-10 rounded-full ml-4"
            />
          )}
          {conversation.isGroup ? (
            <p className="font-bold text-lg">{conversation.name}</p>
          ) : (
            <p className="font-bold text-lg">
              {
                conversation.users.filter((user) => user.clerkId !== userId)[0]
                  .username
              }
            </p>
          )}
        </div>
      </div>
    </nav>
  );
};
