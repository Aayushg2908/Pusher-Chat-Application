"use client";

import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Conversation, Message, User } from "@prisma/client";
import { MenuIcon } from "lucide-react";

export const MobileNav = ({
  users,
  conversations,
}: {
  users: User[];
  conversations: (Conversation & {
    users: User[];
    messages: Message[];
  })[];
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="w-10 h-10" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Sidebar users={users} conversations={conversations} />
      </SheetContent>
    </Sheet>
  );
};
