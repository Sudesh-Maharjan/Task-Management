import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TaskDetailModal from "../components/TaskDetails";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import RightSidebar from "../components/Sidebar";
import axios from "axios";
import debounce from "lodash/debounce"; 
import moment from "moment";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assigneeID: string;
  status: "pending" | "in-progress" | "completed";
  tags: string[];
}

const ListView: React.FC<{
   tasks: Task[];
   onTaskDelete: (id: string) => void;
   onTaskUpdate: (task: Task[]) => void;
   onViewTask: (task: Task) => void;
   onEditTask: (task: Task) => void;
   onDeleteTask: (task: Task) => void;
 }> = ({ tasks, onDeleteTask, onEditTask, onViewTask , onTaskDelete, onTaskUpdate}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortByTitleAsc, setSortByTitleAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch tasks on component mount or when search query changes
    fetchTasks();
  }, [searchQuery]);

  const fetchTasks = debounce(() => {
    axios
      .get(`http://localhost:8000/api/v1/tasks`,{
        params: { tags: searchQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      
      })
      .then((response) => {
        onTaskUpdate(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      });
}, 500);
  
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
 };
 const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value);
};
const formatDueDate = (dueDate) => {
  const due = moment(dueDate);
  const now = moment();
  const daysToGo = due.diff(now, 'days');
  const formattedDate = due.format("DD MMMM YYYY");
  return `${formattedDate} (${daysToGo} days to go)`;
};
  return (
   <>
  <h1 className="text-4xl text-center font-bold">Task List</h1>
  <div className="my-4">
    <div className="flex justify-between mb-4">
      <div className="flex justify-center items-center">
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
                          <MdDelete />
        </Button>
        <div className="container flex justify-center items-center px-4 sm:px-6 lg:px-8 ">
        <div className="relative">

            <input type="text" className="h-10 w-96 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none border border-purple-200" placeholder="Search tasks..."
             value={searchQuery}
             onChange={handleSearchInputChange}></input>

            <div className="absolute top-4 right-3">
                <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
            </div>

        </div>
    </div>
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
            <td className="border border-purple-200 px-4 py-2 capitalize">{formatDueDate(task.dueDate)}</td>
            <td className={`border border-purple-200 px-4 py-2 capitalize ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
              {task.priority}
            </td>
            <td className="border border-purple-200 px-4 py-2 capitalize">{task.status}</td>
            <td className="border border-purple-200 px-4 py-2 flex justify-center ">
              <Button variant={"purple"}
                className="text-white rounded-md mx-5"
                onClick={() => onViewTask(task)}
              >
                <FaEye />
              </Button>
              <Button variant={"purple"}
                className="text-white rounded-md mx-5"
                onClick={() => onEditTask(task)}
              >
                <MdEdit />
              </Button>
              <Button
                variant={"purple"}
                className="text-white rounded-md mx-5"
                onClick={() => onDeleteTask(task._id)}
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {showSidebar && selectedTask && (
        <RightSidebar
          selectedTask={selectedTask}
          onClose={() => {
            setShowSidebar(false);
            setSelectedTask(null);
          }}
        />
        )}
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
