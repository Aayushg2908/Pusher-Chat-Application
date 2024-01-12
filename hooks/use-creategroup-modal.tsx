import { User } from "@prisma/client";
import { create } from "zustand";

interface CreateGroupModalState {
  users: User[];
  open: boolean;
  onOpen: (users: User[]) => void;
  onClose: () => void;
}

export const useCreateGroupModal = create<CreateGroupModalState>((set) => ({
  users: [],
  open: false,
  onOpen: (users) => set(() => ({ open: true, users: users })),
  onClose: () => set(() => ({ open: false, users: [] })),
}));
