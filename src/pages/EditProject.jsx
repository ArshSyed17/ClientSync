import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProject } from '../api';
import ProjectForm from '../components/ProjectForm';

const EditProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await getProject(id);
      setProject(response.data);
    } catch (error) {
      toast.error('Error loading project');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Edit Project</h1>
      {project ? <ProjectForm project={project} isEdit={true} /> : <p className="text-purple-600">Loading...</p>}
    </div>
  );
};

export default EditProject;
