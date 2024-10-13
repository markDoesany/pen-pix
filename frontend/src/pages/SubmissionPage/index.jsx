// src/pages/StudentFileUploadLink/index.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css'; // Import CSS Module

const SubmissionPage = () => {
  const { taskId, randomIdentifier, identifier } = useParams(); // Get taskId and randomIdentifier from URL parameters
  const [task, setTask] = useState(null); // Initialize with null
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const fileInputRef = useRef(null);

  console.log('Received taskId:', taskId, 'Received identifier:', identifier);
  
  // Fetch task details when component mounts
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/task/get-task/${taskId}/${identifier}`);
        console.log('Fetched task data:', response.data);
        if (response.data) {
          setTask(response.data); // Set the single task object
          setErrorMessage(''); // Clear any previous error message
        } else {
          console.error('No task data received or incorrect format');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        setErrorMessage('This link is invalid.'); // Set error message if task fetch fails
      }
    };

    fetchTask();
  }, [taskId, identifier]);

  // Handle file selection
  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file)); // Append selected files

    console.log('Files submitted:', files);

    try {
      // Make API request to submit the files and include taskId and randomIdentifier
      const response = await axios.post(`/files/upload/${taskId}/${randomIdentifier}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Files uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  if (!task) {
    return <div>Loading...</div>; // Display loading state if task is null
  }

  return (
    <div className={styles.app}>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>} {/* Render error message if it exists */}
      <div className={styles.taskDetails}>
        <h2>{task.title || 'Task Title'}</h2>
        <p><strong>Description:</strong> {task.description || 'Task Description'}</p>
        <p><strong>Exam Type:</strong> {task.type || 'Exam Type'}</p>
        <p><strong>Due Date:</strong> {task.due_date || 'Due Date'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className={styles.uploadInput}
          ref={fileInputRef}
        />
        <button type="submit" className={styles.uploadButton}>
          Upload Files
        </button>
      </form>
    </div>
  );
};

export default SubmissionPage;
