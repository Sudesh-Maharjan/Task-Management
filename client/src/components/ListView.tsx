import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskDetailModal from "../components/TaskDetails";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";


const ListView: React.FC<{
   tasks: Task[];
   onTaskDelete: (id: string) => void;
   onTaskUpdate: (task: Task) => void;
 }> = ({ tasks, onTaskDelete, onTaskUpdate }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortByTitleAsc, setSortByTitleAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };
  const handleUpdateTask = (task: Task) => {
   onTaskUpdate(task);
  };
  const handleDeleteSelectedTasks = () => {
    selectedTasks.forEach((taskId) => {
      onTaskDelete(taskId);
    });
    setSelectedTasks([]);
  };
  const handleSelectTask = (taskId: string) => {
   if (selectedTasks.includes(taskId)) {
     setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
   } else {
     setSelectedTasks([...selectedTasks, taskId]);
   }
 };
 const handleSelectAllTasks = () => {
   if (selectAll) {
     setSelectedTasks([]);
   } else {
     setSelectedTasks(tasks.map((task) => task._id));
   }
   setSelectAll(!selectAll);
 };
 const handleSortByTitle = () => {
   const sortedTasks = tasks.slice().sort((a, b) => {
     if (sortByTitleAsc) {
       return a.title.localeCompare(b.title);
     } else {
       return b.title.localeCompare(a.title);
     }
   });
   setSortByTitleAsc(!sortByTitleAsc);
   setSelectedTasks([]);
   setSelectAll(false);
   setTasks(sortedTasks);
 };
  return (
   <>
  <h1 className="text-4xl text-center my-3 font-bold">Task List</h1>
  <div className="my-4">
    <div className="flex justify-between mb-4">
      <div>
        <Button
          variant="purple"
          className="px-4 py-2 mr-2"
          onClick={handleSelectAllTasks}
        >
          {selectAll ? "Deselect All" : "Select All"}
        </Button>
        <Button
          variant="purple"
          className="px-4 py-2"
          onClick={handleDeleteSelectedTasks}
        >
          Delete Selected
        </Button>
      </div>
      
    </div>
    <table className="w-full">
      <thead>
        <tr className="bg-purple-100">
          <th className=" px-4 py-2">Title</th>
          <th className=" px-4 py-2">Description</th>
          <th className=" px-4 py-2">Due Date</th>
          <th className=" px-4 py-2">Priority</th>
          <th className=" px-4 py-2">Status</th>
          <th className=" px-4 py-2 cursor-pointer" onClick={handleSortByTitle}>
            Sort by Title {sortByTitleAsc ? "↓" : "↑"}
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className={`hover:bg-purple-100 hover:cursor-pointer ${selectedTasks.includes(task._id) ? "border border-purple-600" : ""}`}>
            <td className="border border-purple-200 px-4 py-2 capitalize">
              <input
                type="checkbox"
                checked={selectedTasks.includes(task._id)}
                onChange={() => handleSelectTask(task._id)}
                className="mr-2"
              />
              {task.title}
            </td>
            <td className="border border-purple-200 px-4 py-2 capitalize">{task.description}</td>
            <td className="border border-purple-200 px-4 py-2 capitalize">{task.dueDate}</td>
            <td className={`border border-purple-200 px-4 py-2 capitalize ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
              {task.priority}
            </td>
            <td className="border border-purple-200 px-4 py-2 capitalize">{task.status}</td>
            <td className="border border-purple-200 px-4 py-2">
              <Button
                className="text-white px-4 py-2 rounded-md bg-black"
                onClick={() => handleViewTask(task)}
              >
                <FaEye />
              </Button>
              <Button
                className="text-white px-4 py-2 rounded-md ml-2"
                onClick={() => handleUpdateTask(task)}
              >
                <MdEdit />
              </Button>
              <Button
                variant="destructive"
                className="text-white px-4 py-2 rounded-md ml-2"
                onClick={() => onTaskDelete(task._id)}
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {showModal && selectedTask && (
    <TaskDetailModal
      task={selectedTask}
      onClose={() => setShowModal(false)}
    />
  )}
</>

  );
};

export default ListView;
