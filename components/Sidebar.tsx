"use client";

import { cn } from "@/lib/utils";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Users2Icon, MessageCircleMore, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { User } from "@prisma/client";
import Image from "next/image";

export const Sidebar = ({ users }: { users: User[] }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isUsers = pathname === "/users";

  return (
    <aside className="z-30 h-screen sticky left-0 top-0 hidden md:flex w-[300px] border border-r">
      <div className="max-sm:hidden h-full w-[70px] flex flex-col items-center justify-between p-2 border border-r">
        <div className="w-full flex flex-col items-center gap-y-4 mt-4 text-gray-600">
          <Link
            className={cn("p-3 rounded-xl", isHome && "bg-slate-200")}
            href="/"
          >
            <MessageCircleMore className="w-7 h-7" />
          </Link>
          <Link
            className={cn("p-3 rounded-xl", isUsers && "bg-slate-200")}
            href="/users"
          >
            <Users2Icon className="w-7 h-7" />
          </Link>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <Button variant="ghost" size="icon">
              <LogOut className="w-7 h-7" />
            </Button>
          </SignOutButton>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      {isHome && (
        <div className="overflow-y-auto custom-scrollbar w-full flex flex-col gap-y-2 p-2">
          <h1 className="font-bold text-2xl mt-4 ml-1">Messages</h1>
        </div>
      )}
      {isUsers && (
        <div className="overflow-y-auto custom-scrollbar w-full flex flex-col gap-y-8 p-2">
          <h1 className="font-bold text-2xl mt-4 ml-1">People</h1>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-x-2 cursor-pointer ml-1"
            >
              <Image
                src={user.image}
                alt="userLogo"
                width={20}
                height={20}
                className="rounded-full w-10 h-10"
              />
              <p className="font-bold text-lg">{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
