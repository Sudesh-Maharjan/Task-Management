import React from "react";
import { useDrop } from "react-dnd";
import TaskItem from "./TaskIItem";
import {Task} from '../../src/types';

const TaskList:React.FC<{
  //props
  tasks: Task[];
  status: string;
  moveTask: (taskId: string, status: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  color: string;
}> = ({ tasks, status, moveTask, onEditTask, onDeleteTask, onViewTask, color}) => {
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
      <h2 className="relative text-md font-semibold py-2 flex justify-center rounded-t-md text-white" style={{background: color}}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </h2>
      {/* workflow stage */}
      <div className="flex flex-col items-center" style={{ maxHeight: "400px", overflowY: "auto", background:color}}>
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
