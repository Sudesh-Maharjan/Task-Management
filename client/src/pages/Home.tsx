import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import { MdDelete, MdEdit } from "react-icons/md";
import API_BASE_URL from "../../config";
import { Button } from "@/components/ui/button";
import RightSidebar from "../components/Sidebar";
import TaskDetailModal from "../components/TaskDetails";
import { FaPlus } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assigneeID: string;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      console.error("Access token not found in cookies");
      window.location.href = "/";
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get<Task[]>(`${API_BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      });
  };

  const handleTaskSubmit = (task: Task) => {
    const method = task._id ? "put" : "post";
    const url = task._id
      ? `${API_BASE_URL}/tasks/${task._id}`
      : `${API_BASE_URL}/tasks`;

    axios({
      method,
      url,
      data: task,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        fetchTasks();
        setShowSidebar(false);
        setSelectedTask(null);
      })
      .catch((error) => {
        console.error(`Error ${task._id ? "updating" : "creating"} task:`, error);
      });
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowSidebar(true);
  };

  const handleDeleteTask = (id: string) => {
    axios
      .delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto my-14">
        <div className="flex flex-wrap -mx-4">
        {tasks.map((task) => (
            <div
              className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4"
            >
              <div className="bg-purple-100 hover:bg-purple-200 hover:rotate-2 transition duration-500 hover:cursor-pointer hover:shadow-lg p-4 rounded-lg shadow-md flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                  <p className="text-gray-700 mb-2">{task.description}</p>
                  <p className="text-gray-600 mb-2">Due: {task.dueDate}</p>
                  <p className={`mb-2 ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
                    Priority: {task.priority}
                  </p>

                </div>
                <div className="flex justify-end mt-4" key={task._id}>
                <Button 
                   className="text-white px-4 py-2 rounded-md mr-2 flex items-center bg-black"
                    onClick={() => handleViewTask(task)}
                  >
<FaEye />
                    </Button>
                  <Button variant={"purple"}
                    className=" text-white px-4 py-2 rounded-md mr-2 flex items-center"
                    onClick={() => handleEditTask(task)}
                  >
                    <MdEdit className="mr-1" />
                  </Button>
                  <Button variant={"destructive"}
                    className=" text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <MdDelete className="mr-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-4 right-4">
          <Button
            variant={"purple"}
            className="text-white px-4 py-2 rounded-md transform hover:rotate-180 rounded-ss-2xl transition duration-1000"
            onClick={() => setShowSidebar(true)}
          >
           <FaPlus />
          </Button>
        </div>
      </div>
      {showModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onUpdate={() => {
            setShowModal(false);
            setShowSidebar(true);
          }}
        />
      )}
      {showSidebar && (
        <RightSidebar
          selectedTask={selectedTask}
          onClose={() => {
            setShowSidebar(false);
            setSelectedTask(null);
          }}
          onTaskSubmit={handleTaskSubmit}
        />
      )}
    </>
  );
};

export default Home;
