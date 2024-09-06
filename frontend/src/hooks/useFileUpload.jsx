import { useState } from 'react';
import axios from 'axios';

const useFileUpload = (taskId) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('task_id', taskId);

    try {
      setUploading(true);
      setError(null);

      const response = await axios.post('/files/upload-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('Files uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error);
    } finally {
      setUploading(false);
    }
  };

  return { handleUpload, uploading, error };
};

export default useFileUpload;
