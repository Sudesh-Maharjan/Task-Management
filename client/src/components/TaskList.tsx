import React from "react";
import { useDrop } from "react-dnd";
import TaskItem from "./TaskIItem";
import {Task} from '../../src/types';

const TaskList:React.FC<{
  tasks: Task[];
  status: string;
  moveTask: (taskId: string, status: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}> = ({ tasks, status, moveTask, onEditTask, onDeleteTask, onViewTask}) => {
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
      className={` rounded-md ${
        isOver ? "bg-gray-300" : "bg-gray-200"
      }`}
      
    >
      {/* workflow stage title */}
      <h2 className="text-md font-semibold mb-4 flex justify-center bg-purple-400 rounded-t-md text-white">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </h2>
      <div className="flex flex-col items-center" style={{ maxHeight: "400px", overflowY: "auto" }}>
      {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onViewTask={onViewTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
