import React from "react";
import { useDrop } from "react-dnd";
import TaskItem from "./TaskIItem";

const TaskList = ({ tasks, status, moveTask, onEditTask, onDeleteTask, onViewTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item._id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`w-full p-4 rounded-md ${
        isOver ? "bg-gray-300" : "bg-gray-200"
      }`}
      style={{ maxHeight: "500px", overflowY: "auto" }}
    >
      <h2 className="text-lg font-semibold mb-4 flex justify-center">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </h2>
      {tasks.map((task) => (
       <TaskItem
       key={task._id}
       task={task}
       onEditTask={onEditTask}
       onDeleteTask={onDeleteTask}
       onViewTask={onViewTask}
     />
      ))}
    </div>
  );
};

export default TaskList;
