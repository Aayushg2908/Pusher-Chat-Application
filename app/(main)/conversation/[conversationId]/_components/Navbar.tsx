import { auth } from "@clerk/nextjs";
import { Conversation, Message, User } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";

interface NavbarProps {
  conversation: Conversation & { users: User[]; messages: Message[] };
}

export const Navbar = ({ conversation }: NavbarProps) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <nav className="w-full sticky top-0 bg-white h-[70px] border border-l-0 border-b">
      <div className="h-full flex justify-between items-center">
        <div className="h-full flex items-center gap-x-2">
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
          <p className="font-bold text-lg">
            {
              conversation.users.filter((user) => user.clerkId !== userId)[0]
                .username
            }
          </p>
        </div>
      </div>
    </nav>
  );
};
