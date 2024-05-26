import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

interface Task {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assigneeID: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Sidebar: React.FC<{ selectedTask: Task | null; onClose: () => void; onTaskSubmit: (task: Task) => void; }> = ({ selectedTask, onClose, onTaskSubmit }) => {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    dueDate: "",
    priority: "low", // Default value
    assigneeID: ""
  });

  const [users, setUsers] = useState<User[]>([]);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    }
  }, [selectedTask]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get<User[]>(`${API_BASE_URL}/users/allusers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
         // console.log("Users:", response.data)
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };
  //function to handle user assignment

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
   const { id, value } = e.target;
   if (id === "assigneeID") {
     // If the assigneeID field is being updated, find the user object by its ID
     const selectedUser = users.find(user => user._id === value);
     if (selectedUser) {
       // If the selected user exists, update the assigneeID with the selected user's ID
       setTask({ ...task, assigneeID: selectedUser._id });
     } else {
       // If the selected user does not exist, set assigneeID to empty.
       setTask({ ...task, assigneeID: "" });
     }
   } else {
     setTask({ ...task, [id]: value });
   }
 };
  const handleSubmit = () => {
    onTaskSubmit(task);
  };

  return (
    <div className="fixed right-0 top-0 w-1/3 h-full bg-white p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {selectedTask ? "Update Task" : "Create Task"}
      </h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700"
            id="title"
            type="text"
            value={task.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="border rounded w-full py-2 px-3 text-gray-700"
            id="description"
            value={task.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
            Due Date
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700"
            id="dueDate"
            type="date"
            value={task.dueDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            className="border rounded w-full py-2 px-3 text-gray-700"
            id="priority"
            value={task.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assigneeID">
            Assignee
          </label>
          <select
            className="border rounded w-full py-2 px-3 text-gray-700"
            id="assigneeID"
            value={task.assigneeID}
            onChange={handleChange}
          >
            <option value="">Select Assignee</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={handleSubmit}
          >
            {selectedTask ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sidebar;