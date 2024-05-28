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

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assigneeID: string;
  status: "pending" | "in-progress" | "completed";
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [selectedTab, setSelectedTab] = useState("Kanban");

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

  useEffect(() => {
    if (!accessToken) {
      console.error("Access token not found in cookies");
      window.location.href = "/";
      return;
    }
    fetchTasks();
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
      })
      .catch((error) => {
        console.error(
          `Error ${task._id ? "updating" : "creating"} task:`,
          error
        );
      });
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowSidebar(true);
    setIsCreateMode(false);
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

  const moveTask = (taskId: string, status: string) => {
    setTasks((prevTasks) =>
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
      )
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  return (
    <>
      <Navigation />
      <a href="/main">Click hereh bro </a>
      <Tabs onSelectTab={setSelectedTab} />
      {selectedTab === "Kanban" && (
        <div>
          <h1 className="text-4xl text-center my-3 font-bold">Kanban View</h1>
          <div className="my-4 grid grid-cols-3 gap-2">
            <TaskList
              tasks={tasks.filter((task) => task.status === "pending")}
              status="pending"
              moveTask={moveTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask} 
              onDeleteTask={handleDeleteTask}
            />
            <TaskList
              tasks={tasks.filter((task) => task.status === "in-progress")}
              status="in-progress"
              moveTask={moveTask}
              onViewTask={handleViewTask} 
              onEditTask={handleEditTask} 
              onDeleteTask={handleDeleteTask}
            />
            <TaskList
              tasks={tasks.filter((task) => task.status === "completed")}
              status="completed"
              moveTask={moveTask}
              onViewTask={handleViewTask} 
              onEditTask={handleEditTask} 
              onDeleteTask={handleDeleteTask}
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
            onClick={() => {setShowSidebar(true); setSelectedTask(null)}}
          >
           <FaPlus />
          </Button>
        </div>

    </>
  );
};

export default Home;
