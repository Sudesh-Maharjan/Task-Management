import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import API_BASE_URL from "../../config";
import RightSidebar from "../components/Sidebar";
import TaskDetailModal from "../components/TaskDetails";
import "../components/styles.css";
import ListView from "../components/ListView";
import Tabs from "@/components/Tabs";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Task } from "../../src/types";
import { toast, Toaster } from "sonner";
// import { MdDone } from "react-icons/md";
import SaveButton from "@/components/SaveButton";
import ActivityLog from "@/components/ActivityLog";
import moment from "moment";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [selectedTab, setSelectedTab] = useState("Kanban");
  const [pendingColor, setPendingColor] = useState("#C084FC");
  const [inProgressColor, setInProgressColor] = useState("#C084FC");
  const [completedColor, setCompletedColor] = useState("#C084FC");

  //logActivity State returns an array of strings.
  const [activityLog, setActivityLog] = useState<string[]>([]);
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
        toast.error("Error fetching tasks:", error);
        if (error.response) {
          toast.error("Response data:", error.response.data);
        }
      });
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/user/settings`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { pendingColor, inProgressColor, completedColor } = response.data;
      setPendingColor(pendingColor);
      setInProgressColor(inProgressColor);
      setCompletedColor(completedColor);
    } catch (error) {
      toast.error("Error fetching color");
    }
  };

  //Save colors
  const saveColors = async () => {
    setLoading(true);
    try {
      const newColors = { pendingColor, inProgressColor, completedColor };
      await axios.post(`${API_BASE_URL}/users/user/settings`, newColors, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then(() => logActivity("Colors saved successfully!")).catch(() => logActivity("Error saving colors!"));
      toast.success("Colors saved successfully!");
    } 
    
    catch (error) {
      toast.error("Error saving colorsQ");
      
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!accessToken) {
      console.error("Access token not found in cookies");
      window.location.href = "/";
      return;
    }
    fetchTasks();
    fetchColors();
  }, []);

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
        logActivity(task._id ? "Task updated" : "Task created");
      })
      .catch((error) => {
        toast.error(`Error ${task._id ? "updating" : "creating"} task:`, error);
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
        logActivity("Task deleted");
        toast.success("Task deleted successfully!");
      })
      .catch((error) => {
        toast.error("Error deleting task:", error);
      });
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };
  const handleTaskUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const moveTask = (taskId: string, status: string) => {
    setTasks(
      (prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: status } : task
        ) as Task[]
    );
    axios
      .put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then(() => logActivity("Task status updated")).catch(() => logActivity("Error updating task status"))
      .catch((error) => {
        toast.error("Error updating task status:", error);
      });
  };
//Activity Log
const logActivity = (action: string) => {
  const timestamp = moment().format('Do MMMM, dddd, YYYY'); // Format timestamp (Moment js)
  const timeAgo = moment().startOf('minute').fromNow(); // Calculate time ago 
  const logEntry = `${timestamp} ${timeAgo}: ${action}`
  setActivityLog((prevLog) =>  [`${timestamp} ${timeAgo}: ${action}`, ...prevLog]); //prevLog -> takes the previous activity log and return a new array

  axios.post(`${API_BASE_URL}/activity`, { action: logEntry}, {
headers: {
  Authorization: `Bearer ${accessToken}`,
},
}).catch((error) =>{
  toast.error("Error logging activity:", error);

});
};

  return (
    <>
      <Navigation />
      <Toaster />
      <Tabs onSelectTab={setSelectedTab} />
      {selectedTab === "Kanban" && (
        
        <div>
           <div className="flex flex-col items-end">
            <div className="flex justify-center">
            <div className="block text-sm font-medium text-gray-700">
              <input
                type="color"
                value={pendingColor}
                onChange={(e) => setPendingColor(e.target.value)}
                className="mt-1 hover:cursor-pointer"
              />
            </div>
            <div className="block text-sm font-medium text-gray-700">
              <input
                type="color"
                value={inProgressColor}
                onChange={(e) => setInProgressColor(e.target.value)}
                className="mt-1 hover:cursor-pointer"
              />
            </div>
            <div className="block text-sm font-medium text-gray-700">
              <input
                type="color"
                value={completedColor}
                onChange={(e) => setCompletedColor(e.target.value)}
                className="mt-1 hover:cursor-pointer"
              />
            </div>
            </div>
            <SaveButton saveColors={saveColors} loading={loading} />
          </div>
          <h1 className="text-3xl text-center font-bold">Kanban View</h1>
          <div className=" b-1 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <TaskList
              tasks={tasks.filter((task) => task.status === "pending")}
              status="pending"
              moveTask={moveTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              color={pendingColor}
            />
            <TaskList
              tasks={tasks.filter((task) => task.status === "in-progress")}
              status="in-progress"
              moveTask={moveTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              color={inProgressColor}
            />
            <TaskList
              tasks={tasks.filter((task) => task.status === "completed")}
              status="completed"
              moveTask={moveTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              color={completedColor}
            />
          </div>
         
        </div>
      )}
    
      {selectedTab === "List" && (
        <ListView
          tasks={tasks}
          onEditTask={handleEditTask}
          onTaskDelete={handleDeleteTask}
          onDeleteTask={handleDeleteTask}
          onViewTask={handleViewTask}
          onTaskUpdate={handleTaskUpdate}
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
      <div className="fixed bottom-4 right-4">
        <Button
          variant={"purple"}
          className="text-white px-4 py-2 rounded-md transform hover:rotate-180 rounded-ss-2xl transition duration-1000"
          onClick={() => {
            setShowSidebar(true);
            setSelectedTask(null);
          }}
        >
          <FaPlus />
        </Button>
      </div>
      <div className="">
        {/* Activity Log component with prop passed */}
        <ActivityLog activityLog={activityLog}/>
      </div>
    </>
  );
};

export default Home;
