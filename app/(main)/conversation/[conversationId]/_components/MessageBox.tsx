import { cn } from "@/lib/utils";
import { Message, User } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

export const MessageBox = ({
  data,
  user,
}: {
  data: Message & { sender: User };
  user: User;
}) => {
  const isOwn = data.senderId === user.id;

  return (
    <div className={cn("flex gap-3 p-4", isOwn && "justify-end")}>
      <div className={cn(isOwn && "order-2")}>
        <Image
          src={data.sender.image}
          alt="profile"
          width={20}
          height={20}
          className="rounded-full w-10 h-10"
        />
      </div>
      <div className={cn("flex flex-col gap-2", isOwn && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.username}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div
          className={cn(
            "text-sm w-fit overflow-hidden",
            isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
            data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
          )}
        >
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
      </div>
    </div>
  );
};
