import { Column, Id, Task } from "@/type";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
// import TrashIcon from "../icons/TrashIcon";
// import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "../Task";
// import PlusIcon from "../icons/PlusIcon";
// import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  //   createTask: (columnId: Id) => void;
  //   updateTask: (id: Id, content: string) => void;
  //   deleteTask: (id: Id) => void;
  //   tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
}: //   createTask,
//   tasks,
//   deleteTask,
//   updateTask,
Props) {
  const [editMode, setEditMode] = useState(false);

  //   const tasksIds = useMemo(() => {
  //     return tasks.map((task) => task.id);
  //   }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
            w-80 min-h-full cursor-pointer rounded-lg 
            border-2 border-slate-200 p-4 
            flex gap-2 items-center
        "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 min-h-full rounded-lg flex flex-col bg-slate-200 p-2"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-slate-100 text-md cursor-grab rounded-md p-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              className="rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="rounded py-2 px-1"
        >
          Delete
        </button>
      </div>

      {/* Column task container */}
      {/* <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div> */}
      {/* Column footer */}
      {/* <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        Add task
      </button> */}
    </div>
  );
}

export default ColumnContainer;
