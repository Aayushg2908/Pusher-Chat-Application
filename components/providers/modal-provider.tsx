"use client";

import { useEffect, useState } from "react";
import { CreateGroupModal } from "../CreateGroupModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateGroupModal />
    </>
  );
};
