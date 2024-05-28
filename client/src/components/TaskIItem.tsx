import React from "react";
import { useDrag } from "react-dnd";
import { MdDelete, MdEdit } from "react-icons/md"
import { FaEye } from "react-icons/fa";
import { Button } from "./ui/button";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FaCircleUser } from "react-icons/fa6";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}
const TaskItem = ({ task, onEditTask, onDeleteTask, onViewTask, assignedUser}) => {
  console.log(assignedUser)
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { _id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const formatDueDate = (dueDate) => {
    const due = moment(dueDate);
    const now = moment();
    const daysToGo = due.diff(now, 'days');
    const formattedDate = due.format("DD MMMM YYYY");
    return `${formattedDate} (${daysToGo} days to go)`;
  };
  return (
    <div
      ref={drag}
      className={`w-[400px] h-[250px] relative m-2 p-4 rounded-lg shadow-md flex flex-col justify-between hover:cursor-pointer ${
        isDragging ? "bg-gray-400" : "bg-purple-100"
      }`}
    >
      <div className="absolute right-6">
      <Popover> 
  <PopoverTrigger className="text-3xl"><FaCircleUser /></PopoverTrigger>
  <PopoverContent>
   
  {assignedUser ? (
              <div>
                <div>{`${assignedUser.firstName} ${assignedUser.lastName}`}</div>
                <div>{assignedUser.email}</div>
              </div>
            ) : (
              "No Assignee"
            )}
  </PopoverContent>
</Popover>

      </div>
      <div className="text-lg font-semibold mb-2 capitalize">{task.title}</div>
      <div className="text-gray-700 mb-2 capitalize">{task.description}</div>
      <div className="text-gray-600 mb-2 capitalize">Due: {formatDueDate(task.dueDate)}</div>
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
