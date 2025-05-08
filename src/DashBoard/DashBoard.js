import React, { useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase"; // make sure firebase is correctly initialized
import "../App.css";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskContent, setEditingTaskContent] = useState("");
  const [user, setUser] = useState(null);

  // Fetch tasks (memoized)
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setMessage("Please log in to view tasks.");
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "tasks"));
      const tasksList = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTasks(tasksList);
    } catch (e) {
      console.error("Error fetching tasks: ", e);
      setMessage("Error fetching tasks.");
    }
  }, [user]);

  // Add task
  const addTask = async () => {
    if (task === "") {
      setMessage("Oops! A task without a name? That’s a no-go!");
      return;
    }

    if (!user) {
      setMessage("Please log in to add tasks.");
      return;
    }

    try {
      const tasksCollectionRef = collection(db, "users", user.uid, "tasks");
      const timestamp = new Date().toISOString();
      const taskDocRef = doc(tasksCollectionRef, timestamp);

      await setDoc(taskDocRef, {
        tasks: task,
        completed: false
      });

      setMessage("Task added!");
      setTask("");
      fetchTasks();
    } catch (e) {
      console.error("Error adding task: ", e);
      setMessage("Error adding task.");
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load tasks when user is set
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  // Delete task with animation
  const deleteTask = async (taskId) => {
    setDeletingTaskId(taskId);
    setTimeout(async () => {
      try {
        await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
        setMessage("Task deleted.");
        fetchTasks();
        setDeletingTaskId(null);
      } catch (e) {
        console.error("Error deleting task: ", e);
        setMessage("Error deleting task.");
        setDeletingTaskId(null);
      }
    }, 500);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setTasks([]);
      setMessage("You have been logged out.");
    } catch (e) {
      console.error("Error logging out: ", e);
      setMessage("Error logging out.");
    }
  };
  
  // Toggle task completion
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await setDoc(
        doc(db, "users", user.uid, "tasks", taskId),
        { completed: !currentStatus },
        { merge: true }
      );
      fetchTasks();
    } catch (e) {
      console.error("Error completing task: ", e);
    }
  };
  
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // Redirect to the login page
    navigate("/signin"); // Assuming the login page is '/login'
    
    // Optionally, trigger the login process if using Firebase authentication:
    // auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };
  // Edit task
  const saveEditTask = async () => {
    try {
      await setDoc(
        doc(db, "users", user.uid, "tasks", editingTaskId),
        { tasks: editingTaskContent },
        { merge: true }
      );
      setMessage("Task updated.");
      setEditingTaskId(null);
      setEditingTaskContent("");
      fetchTasks();
    } catch (e) {
      console.error("Error editing task: ", e);
    }
  };

  const startEditing = (taskId, currentTask) => {
    setEditingTaskId(taskId);
    setEditingTaskContent(currentTask);
  };

  return (
    <div className="App">
      {user && <div className="user-info">{user.displayName || user.email}</div>}

      <div className="heading-container">
        <div className="hanging-nail"></div>
        <h1 className="hanging-heading">
          <span>T</span>
          <span>o</span>
          <span className="blue-letter">d</span>
          <span className="blue-letter">o</span>
          <span> </span>
          <span>L</span>
          <span>i</span>
          <span className="blue-letter">s</span>
          <span className="blue-letter">t</span>
        </h1>
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((taskItem) => (
            <div
              key={taskItem.id}
              className={`task-wrapper ${taskItem.isNew ? "newly-added" : ""} ${
                deletingTaskId === taskItem.id ? "deleting" : ""
              }`}
            >
              <div className={`task-box ${taskItem.completed ? "completed" : ""}`}>
                {editingTaskId === taskItem.id ? (
                  <input
                    type="text"
                    value={editingTaskContent}
                    onChange={(e) => setEditingTaskContent(e.target.value)}
                  />
                ) : (
                  <span>{taskItem.tasks}</span>
                )}
              </div>

              <div className="task-actions-outside">
                {editingTaskId === taskItem.id ? (
                  <button onClick={saveEditTask} className="icon-btn">
                    <i className="fas fa-save"></i>
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(taskItem.id, taskItem.tasks)}
                    className="icon-btn"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}

                <button
                  onClick={() => toggleTaskCompletion(taskItem.id, taskItem.completed)}
                  className="icon-btn"
                >
                  <i
                    className={`fas ${
                      taskItem.completed ? "fa-check-circle black-completed" : "fa-circle blue-pending"
                    }`}
                  ></i>
                </button>

                <button
                  onClick={() => deleteTask(taskItem.id)}
                  className="icon-btn"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
      {user && (
  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
)}
{!user && (
  <button className="login-btn" onClick={handleLogin}>
    Login
  </button>
)}


    </div>
  );
};

export default App;
