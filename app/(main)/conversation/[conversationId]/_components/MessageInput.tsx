"use client";

import React from "react";
import { CldUploadButton } from "next-cloudinary";
import { SendHorizonal, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createMessage } from "@/actions/message";

export const MessageInput = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpload = async (result: any) => {
    try {
      await createMessage({ conversationId, image: result.info.secure_url });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    if (value === "") {
      toast.error("Message cannot be empty");
      setIsLoading(false);
    } else {
      try {
        await createMessage({ conversationId, message: value });
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
        setValue("");
      }
    }
  };

  return (
    <div className="sticky bottom-5 flex items-center p-3 ml-2">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="grwkis5v"
      >
        <UploadCloud size={30} className="text-sky-500" />
      </CldUploadButton>
      <form onSubmit={handleSubmit} className="flex w-full">
        <Input
          disabled={isLoading}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message..."
          className="mx-2 rounded-full bg-slate-100"
        />
        <Button
          disabled={isLoading}
          className="bg-sky-500"
          type="submit"
          variant="ghost"
          size="icon"
        >
          <SendHorizonal className="text-white" />
        </Button>
      </form>
    </div>
  );
};
