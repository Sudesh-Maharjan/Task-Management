import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TaskDetailModal from "../components/TaskDetails";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import RightSidebar from "../components/Sidebar";
import axios from "axios";
import debounce from "lodash/debounce";
import moment from "moment";
import { Task } from "../../src/types";

const ListView: React.FC<{
  tasks: Task[];
  onTaskDelete: (id: number) => void;
  onTaskUpdate: (task: Task[]) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}> = ({
  tasks,
  onDeleteTask,
  onEditTask,
  onViewTask,
  onTaskDelete,
  onTaskUpdate,
}) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortByTitleAsc, setSortByTitleAsc] = useState(true);
  const [sortByDueDateAsc, setSortByDueDateAsc] = useState(false);
  const [sortByPriorityAsc, setSortByPriorityAsc] = useState(true);
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
      .get(`http://localhost:8000/api/v1/tasks`, {
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
  const handleSelectTask = (taskId: number) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  const handleSelectAllTasks = (taskId: number) => {
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
    onTaskUpdate(sortedTasks);
    setSelectedTasks([]);
    setSelectAll(false);
  };
  const handleSortByDueDate = () => {
    const sortedTasks = tasks.slice().sort((a, b) => {
      const dueDateA = moment(a.dueDate);
      const dueDateB = moment(b.dueDate);
      if (sortByDueDateAsc) {
        return dueDateA.isBefore(dueDateB) ? -1 : 1; // Ascending sort
      } else {
        return dueDateB.isBefore(dueDateA) ? -1 : 1; // Descending sort (latest first)
      }
    });
    setSortByDueDateAsc(!sortByDueDateAsc);
    onTaskUpdate(sortedTasks);
    setSelectedTasks([]);
    setSelectAll(false);
  };
  const handleSortByPriority = () => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = tasks.slice().sort((a, b) => {
      if (sortByPriorityAsc) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });
    setSortByPriorityAsc(!sortByPriorityAsc);
    onTaskUpdate(sortedTasks);
    setSelectedTasks([]);
    setSelectAll(false);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };
  const formatDueDate = (dueDate: string) => {
    const due = moment(dueDate);
    const now = moment();
    const daysToGo = due.diff(now, "days");
    const formattedDate = due.format("DD MMMM YYYY");
    return `${formattedDate} (${daysToGo} days to go)`;
  };

  const tagColors = [
    "bg-purple-300",
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
  ];
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
                <input
                  type="text"
                  className="h-10 w-96 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none border border-purple-200"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                ></input>

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
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={handleSortByTitle}
              >
                Sort by Title {sortByTitleAsc ? "↓" : "↑"}
              </th>
              <th className=" px-4 py-2">Description</th>
              <th
                className={`px-4 py-2 cursor-pointer ${
                  sortByDueDateAsc ? "text-black-500" : "text-gray-500"
                }`}
                onClick={handleSortByDueDate}
              >
                Due Date {sortByDueDateAsc ? "↓" : "↑"}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={handleSortByPriority}
              >
                Sort by Priority {sortByPriorityAsc ? "↓" : "↑"}
              </th>
              <th className=" px-4 py-2">Status</th>
              <th className="px-4 py-2">Tags</th>
              <th className="px-4 py-2">Functions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className={`hover:bg-purple-100 hover:cursor-pointer ${
                  selectedTasks.includes(task._id)
                    ? "border border-purple-600"
                    : ""
                }`}
              >
                <td className="border border-purple-200 px-4 py-2 capitalize">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleSelectTask(task._id)}
                    className="mr-2"
                  />
                  {task.title}
                </td>
                <td className="border border-purple-200 px-4 py-2 capitalize">
                  {task.description}
                </td>
                <td className="border border-purple-200 px-4 py-2 capitalize">
                  {formatDueDate(task.dueDate)}
                </td>
                <td
                  className={`border border-purple-200 px-4 py-2 capitalize ${
                    task.priority === "high"
                      ? "text-red-500"
                      : task.priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {task.priority}
                </td>
                <td className="border border-purple-200 px-4 py-2 capitalize">
                  {task.status}
                </td>
                <td className="border border-purple-200 px-4 py-2 relative group">
                  <div className="flex flex-wrap flex-col items-center">
                    {task.tags.length > 1 && (
                      <span className="text-xs font-bold text-gray-500">
                        {task.tags.length} tags
                      </span>
                    )}
                    {task.tags.slice(0, 1).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          tagColors[index % tagColors.length]
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {task.tags.length > 1 && (
                    <div className="absolute left-0 top-full mt-1 w-max p-2 bg-white border border-gray-300 rounded shadow-lg hidden group-hover:block z-10">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 m-1 rounded-full text-sm capitalize ${
                            tagColors[index % tagColors.length]
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="border border-purple-200 px-4 py-2 flex justify-center ">
                  <Button
                    variant={"purple"}
                    className="text-white rounded-md mx-5"
                    onClick={() => onViewTask(task)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    variant={"purple"}
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
