import ProjectForm from '../components/ProjectForm';

const AddProject = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add New Project</h1>
      <ProjectForm />
    </div>
  );
};

export default AddProject;
