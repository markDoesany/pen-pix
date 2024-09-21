// src/pages/StudentFileUploadLink/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css'; // Import CSS Module

const StudentUploadLink = () => {
  const { taskId } = useParams(); // Get taskId from URL parameters
  const [task, setTask] = useState(null); // Initialize with null
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch task details from the server
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/task/get-task/${taskId}`);
        console.log('Fetched task data:', response.data);
        if (response.data) {
          setTask(response.data); // Set the single task object directly
        } else {
          console.error('No task data received or data format is incorrect');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    console.log('Files submitted:', files);

    // Here you would typically make an API request to upload the files
    // axios.post('/upload', formData)
    //      .then(response => console.log('Files uploaded', response))
    //      .catch(error => console.error('Error uploading files', error));
  };

  if (!task) {
    return <div>Loading...</div>; // Display loading state if task is null
  }

  return (
    <div className={styles.app}>
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
        <button type="submit" className={styles.uploadButton}>Upload Files</button>
      </form>
    </div>
  );
};

export default StudentUploadLink;
