import React from "react";
import { useDrop } from "react-dnd";
import TaskItem from "./TaskIItem";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assigneeID: string;
  status: "pending" | "in-progress" | "completed";
  color?: { [key: string]: string };
}
const TaskList:React.FC<{
  tasks: Task[];
  status: string;
  moveTask: (taskId: string, status: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}> = ({ tasks, status, moveTask, onEditTask, onDeleteTask, onViewTask }) => {
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
