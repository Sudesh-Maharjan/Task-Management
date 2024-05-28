import React from "react";
import { useDrag } from "react-dnd";
import { MdDelete, MdEdit } from "react-icons/md"
import { FaEye } from "react-icons/fa";
import { Button } from "./ui/button";
const TaskItem = ({ task, onEditTask, onDeleteTask, onViewTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { _id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`w-[400px] h-[250px] m-2 p-4 rounded-lg shadow-md flex flex-col justify-between hover:cursor-pointer ${
        isDragging ? "bg-gray-400" : "bg-purple-100"
      }`}
    >
      <div className="text-lg font-semibold mb-2 capitalize">{task.title}</div>
      <div className="text-gray-700 mb-2 capitalize">{task.description}</div>
      <div className="text-gray-600 mb-2 capitalize">Due: {task.dueDate}</div>
      <div
        className={`mb-2 capitalize ${
          task.priority === "high"
            ? "text-red-500"
            : task.priority === "medium"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        Priority: {task.priority}
      </div>
      <div className="capitalize">Status: {task.status}</div>
      <div className="mt-4 flex justify-end">
        <Button variant={"purple"}
          className="text-white px-4 py-2 rounded-md mr-2 flex items-center"
          onClick={() => onViewTask(task)}
        >
          <FaEye />
        </Button>
        <Button variant={"purple"}
          className=" text-white px-4 py-2 rounded-md mr-2 flex items-center"
          onClick={() => onEditTask(task)}
        >
          <MdEdit className="mr-1" />
          
        </Button>
        <Button variant={"purple"}
          className=" text-white px-4 py-2 rounded-md flex items-center "
          onClick={() => onDeleteTask(task._id)}
        >
          <MdDelete className="mr-1" />
          
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
