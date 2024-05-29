import React from "react";
import { MdClose } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { Task } from "@/types";
interface TaskDetailModalProps {
  task: Task;
  assignedUser: { firstName: string; lastName: string; email: string } | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, assignedUser, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
      <div className="">
     
          {assignedUser && (
            <div className="bg-purple-500 text-white px-4 py-2 rounded-md">
              <span>{assignedUser.firstName} {assignedUser.lastName}</span>
              <span className="text-sm">({assignedUser.email})</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Details</h2>
          <button onClick={onClose} className="transform hover:rotate-180 transition duration-1000">
            <MdClose size={24} />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Title</h3>
          <p className="capitalize">{task.title}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="capitalize">{task.description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Due Date</h3>
          <p className="capitalize">{task.dueDate}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Priority</h3>
          <p className="capitalize">{task.priority}</p>
        </div>
        <div className="absolute bottom-4 right-3">
          <Button variant={"purple"} onClick={() => onUpdate(task)} className="mr-2">
          <MdEdit className="mr-1" />

          </Button>
        </div>
        <div className=" mb-4">
        <h3 className="text-lg font-semibold">Priority</h3>

            <span>{task.status}</span>
          </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
