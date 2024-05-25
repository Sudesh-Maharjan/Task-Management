import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import { MdDelete, MdEdit } from "react-icons/md";
import API_BASE_URL from "../../config";
import { Button } from "@/components/ui/button";
interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

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

  const handleCreateTask = () => {
    axios
      .post(`${API_BASE_URL}/tasks`, newTask, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchTasks(); // Refresh tasks after creating  new one
        resetForm();
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  const handleUpdateTask = (id: string) => {
    // Find the selected task
    const taskToUpdate = tasks.find((task) => task._id === id);
    if (taskToUpdate) {
      // Set the selected task data to the update form
      setSelectedTask(taskToUpdate);
      setShowUpdateForm(true); // Open the update form
    } else {
      console.error("Task not found for update");
    }
  };
  
  const handleSubmitUpdate = () => {
    // Send a request to update the task data to the API
    axios
      .put(`${API_BASE_URL}/tasks/${selectedTask?._id}`, selectedTask, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchTasks(); // Refresh tasks after updating
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const resetForm = () => {
    setNewTask({
      _id: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "",
    });
    setSelectedTask(null);
    setShowCreateForm(false);
    setShowUpdateForm(false);
  };

  const handleDeleteTask = (id: string) => {
    axios
      .delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchTasks(); // Refresh tasks after deleting
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto my-14">
        <div className="flex flex-wrap -mx-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4"
            >
              <div className="bg-purple-100 border border-purple-300 rounded-md p-4 flex justify-between">
                <div className="">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  {task.title}
                </h3>
                <p className="text-purple-800 mb-2">{task.description}</p>
                <p className="text-purple-800">Due Date: {task.dueDate}</p>
                <p className="text-purple-800">Priority: {task.priority}</p>
                </div>
                <div className="flex justify-start items-start ">
                  <Button variant={"purple"}
                    onClick={() => handleUpdateTask(task._id)}
                    className=" text-white px-4rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                   <MdEdit />
                  </Button>
                  <Button
                   variant={"red"} onClick={() => handleDeleteTask(task._id)}
                    className=" text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <MdDelete />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-500">
            <div className="absolute top-0 right-0 h-full bg-purple-100 border-l border-purple-300 w-96 p-4 transform transition-transform ease-in-out duration-500">
              <Button 
                onClick={() => setShowCreateForm(false)}
                className="hover:bg-transparent bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-700 transform hover:rotate-180 duration-1000"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
              <h2 className="text-xl font-semibold text-purple-700 mb-4">
                Create New Task
              </h2>
              {/* Create task form */}
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus:border-purple-500 focus:outline-none mb-4"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus:border-purple-500 focus:outline-none mb-4"
              />
              <input
                type="text"
                placeholder="Due Date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus:border-purple-500 focus:outline-none mb-4"
              />
              <input
                type="text"
                placeholder="Priority"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus:border-purple-500 focus:outline-none mb-4"
              />
              <Button variant={"purple"}
                onClick={handleCreateTask}
              >
                Create
              </Button>
            </div>
          </div>
        )}
        {showUpdateForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-500">
            <div className="absolute top-0 right-0 h-full bg-purple-100 border-l border-purple-300 w-96 p-4 transform transition-transform ease-in-out duration-500">
              <button
                onClick={() => setShowUpdateForm(false)}
                className="p-2
"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-700 transform hover:rotate-180 duration-1000"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-purple-700 mb-4">
                Update Task
              </h2>
              {/* Update task form */}
              <input
                type="text"
                placeholder="Title"
                value={selectedTask?.title || ""}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask!, title: e.target.value })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus
focus
mb-4"
              />
              <textarea
                placeholder="Description"
                value={selectedTask?.description || ""}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask!,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus
focus
mb-4"
              />
              <input
                type="text"
                placeholder="Due Date"
                value={selectedTask?.dueDate || ""}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask!, dueDate: e.target.value })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus
focus
mb-4"
              />
              <input
                type="text"
                placeholder="Priority"
                value={selectedTask?.priority || ""}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask!,
                    priority: e.target.value,
                  })
                }
                className="w-full p-2 rounded-md border border-purple-300 focus
focus
mb-4"
              />
              <Button variant={"purple"}
                onClick= {handleSubmitUpdate}
              >
                Update
              </Button>
            </div>
          </div>
        )}

        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="fixed bottom-4 right-4
          bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all transform hover:rotate-180 duration-1000"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
