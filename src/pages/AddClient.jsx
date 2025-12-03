import ClientForm from '../components/ClientForm';

const AddClient = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Add New Client</h1>
      <ClientForm />
    </div>
  );
};

export default AddClient;
