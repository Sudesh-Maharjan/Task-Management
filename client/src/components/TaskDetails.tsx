import React from "react";
import { MdClose } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { Task } from "@/types";
import { useSpring, animated } from "@react-spring/web";

interface TaskDetailModalProps {
  task: Task;
  assignedUser: { firstName: string; lastName: string; email: string } | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, assignedUser, onClose, onUpdate }) => {
  const animation = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(-20px)" },
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <animated.div style={animation} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <div className="bg-purple-500 text-white px-4 py-2 rounded-md mb-4">
          {assignedUser ? (
            <>
              <span className="block text-lg font-semibold">
                {assignedUser.firstName} {assignedUser.lastName}
              </span>
              <span className="text-sm">{assignedUser.email}</span>
            </>
          ) : (
            <span>.</span>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Task Details</h2>
          <button
            onClick={onClose}
            className="transform hover:rotate-180 transition duration-500"
          >
            <MdClose size={24} />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Title</h3>
          <p className="capitalize text-gray-700">{task.title}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="capitalize text-gray-700">{task.description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Due Date</h3>
          <p className="capitalize text-gray-700">{task.dueDate}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Priority</h3>
          <p className="capitalize text-gray-700">{task.priority}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold capitalize">Status</h3>
          <p className="capitalize text-gray-700">{task.status}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 right-3">
          <Button variant={"purple"} onClick={() => onUpdate(task)} className="mr-2">
            <MdEdit className="mr-1" />
          </Button>
        </div>
      </animated.div>
    </div>
  );
};

export default TaskDetailModal;
