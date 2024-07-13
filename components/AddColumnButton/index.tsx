"use client";

import { cn } from "@/lib/utils";

type AddColumnButtonProps = {
  onClick: () => void;
};

const AddColumnButton = ({ onClick }: AddColumnButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-20 min-w-80 cursor-pointer rounded-lg bg-slate-200 border-2 p-4 flex gap-2 items-center",
        "w-[var(--column-width)]"
      )}
    >
      Add Column
    </div>
  );
};

export default AddColumnButton;
