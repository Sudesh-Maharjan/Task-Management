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
import '../components/styles.css'
import { DropResult } from "react-beautiful-dnd";
import ListView from '../components/ListView'
import Tabs from "@/components/Tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  
  //workflow stages
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const completedTasks = tasks.filter(task => task.status === "completed");

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
  //handle Tab section
  // const handleTabSelect = (tab: string) => {
  //   setSelectedTab(tab);
  // };

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
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
  if (!destination) return;

  if (destination.droppableId === source.droppableId && destination.index === source.index) {
    return;
  }

  const updatedTasks = [...tasks];
    const draggedTask = updatedTasks.find(task => task._id === draggableId);

    if (draggedTask) {
      draggedTask.status = destination.droppableId as Task['status'];

  axios.put(`${API_BASE_URL}/tasks/${draggableId}`, { status: destination.droppableId }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(() => {
    setTasks(updatedTasks);
  }).catch((error) => {
    console.error("Error updating task status:", error);
  });
  }
  };

  return (
    <>
      <Navigation />
      <Tabs  onSelectTab={setSelectedTab}/>
      {selectedTab === "Kanban" && (
        <div className="">
        <h1 className="text-4xl text-center my-3 font-bold">Kanban View</h1>
      <div className="my-4 grid grid-cols-3 gap-2">
      <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex justify-between h-80 gap-2">
            {/* Droppable for Pending tasks */}
            <Droppable droppableId="pending">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-[600px] bg-red-100 p-4 rounded-md  hover:cursor-pointer scrollable-container"  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  <h2 className="text-lg font-semibold mb-4 flex justify-center">Pending</h2>
                  {pendingTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-[400px] h-[250px] m-2  bg-purple-100 hover:bg-purple-200 transition duration-500 hover:cursor-pointer hover:shadow-lg p-4 rounded-lg shadow-md flex flex-col justify-between"
                        >
                           <div className="text-lg font-semibold mb-2">{task.title}</div>
          <div className="text-gray-700 mb-2">{task.description}</div>
          <div className="text-gray-600 mb-2">Due: {task.dueDate}</div>
          <div className={`mb-2 ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
            Priority: {task.priority}
                        </div>
                        <div>Status: {task.status}</div>
                        <div className="flex justify-end relative">
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
                        
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* Similarly, add Droppable components for In Progress and Completed stages */}
          </div>
          <div className="flex justify-between mb-8 h-80 gap-2">
            <Droppable droppableId="in-progress">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-[600px] bg-yellow-100 p-4 rounded-md mr-2 hover:cursor-pointer scrollable-container"  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  <h2 className="text-lg font-semibold mb-4 flex justify-center">In Progress</h2>
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-[400px] h-[250px] m-2 bg-purple-100 hover:bg-purple-200 transition duration-500 hover:cursor-pointer hover:shadow-lg p-4 rounded-lg shadow-md flex flex-col justify-between" 
                        >
                           <div className="text-lg font-semibold mb-2">{task.title}</div>
          <div className="text-gray-700 mb-2">{task.description}</div>
          <div className="text-gray-600 mb-2">Due: {task.dueDate}</div>
          <div className={`mb-2 ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
            Priority: {task.priority}
                        </div>
                        <div>Status: {task.status}</div>
                        <div className="flex justify-end mt-4">
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
                        
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* Similarly, add Droppable components for In Progress and Completed stages */}
          </div>

        {/* completed */}
          <div className="flex justify-between mb-8 h-80 gap-2">
            {/* Droppable for Pending tasks */}
            <Droppable droppableId="completed">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-[600px] bg-green-200 p-4 rounded-md mr-2 hover:cursor-pointer scrollable-container"  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  <h2 className="text-lg font-semibold mb-4 flex justify-center">Completed</h2>
                  {/* Display tasks for pending stage */}
                  {completedTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className=" w-[400px] h-[250px]  m-2 bg-purple-100 hover:bg-purple-200 transition duration-500 hover:cursor-pointer hover:shadow-lg p-4 rounded-lg shadow-md flex flex-col h-full justify-between"
                        >
                           <div className="text-lg font-semibold mb-2">{task.title}</div>
          <div className="text-gray-700 mb-2">{task.description}</div>
          <div className="text-gray-600 mb-2">Due: {task.dueDate}</div>
          <div className={`mb-2 ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
            Priority: {task.priority}
                        </div>
                        <div>Status: {task.status}</div>
                        <div className="flex justify-end mt-4">
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
                        
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* Similarly, add Droppable components for In Progress and Completed stages */}
          </div>
        </DragDropContext>

        {/* <div className="flex flex-wrap -mx-4">
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
                  <p>Status: {task.status}</p>
                </div>
                <div className="flex justify-end mt-4">
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
        </div> */}
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
      </div>
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
      {selectedTab === "List" && (
       <ListView tasks={tasks} onTaskDelete={handleDeleteTask} onTaskUpdate={handleEditTask}/>
      )}
    </>
  );
};

export default Home;
