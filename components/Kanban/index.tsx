"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import AddTaskButton from "../AddTaskButton";
import { Column, Id, Task } from "@/type";
import { useMemo, useState } from "react";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { defaultCols, defaultTasks } from "@/constant";
import { createPortal } from "react-dom";
import ColumnContainer from "../ColumnContainer";
import TaskCard from "../Task";

function generateId() {
  return Math.floor(Math.random() * 10001);
}

const Kanban = () => {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  //   const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  //   function createTask(columnId: Id) {
  //     const newTask: Task = {
  //       id: generateId(),
  //       columnId,
  //       content: `Task ${tasks.length + 1}`,
  //     };

  //     setTasks([...tasks, newTask]);
  //   }

  //   function deleteTask(id: Id) {
  //     const newTasks = tasks.filter((task) => task.id !== id);
  //     setTasks(newTasks);
  //   }

  //   function updateTask(id: Id, content: string) {
  //     const newTasks = tasks.map((task) => {
  //       if (task.id !== id) return task;
  //       return { ...task, content };
  //     });

  //     setTasks(newTasks);
  //   }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    // if (event.active.data.current?.type === "Task") {
    //   setActiveTask(event.active.data.current.task);
    //   return;
    // }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    // setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-4 bg-slate-500 p-4 w-full overflow-x-auto h-[calc(100vh-5rem)]">
        <div className="flex gap-4 ">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                // createTask={createTask}
                // deleteTask={deleteTask}
                // updateTask={updateTask}
                // tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ))}
          </SortableContext>
        </div>
        <div
          onClick={() => {
            createNewColumn();
          }}
          className="
            h-20 min-w-80 cursor-pointer rounded-lg 
            bg-slate-200 border-2 p-4 
            flex gap-2 items-center
          "
        >
          <h2 className="text-xl font-semibold">Add Column</h2>
        </div>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              deleteColumn={deleteColumn}
              updateColumn={updateColumn}
              //   createTask={createTask}
              //   deleteTask={deleteTask}
              //   updateTask={updateTask}
              //   tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />
          )}
          {/* {activeTask && (
            <TaskCard
              task={activeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )} */}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default Kanban;
