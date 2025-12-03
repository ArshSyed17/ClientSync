import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getClient } from '../api';
import ClientForm from '../components/ClientForm';

const EditClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const response = await getClient(id);
      setClient(response.data);
    } catch (error) {
      toast.error('Error loading client');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Edit Client</h1>
      {client ? <ClientForm client={client} isEdit={true} /> : <p className="text-blue-600">Loading...</p>}
    </div>
  );
};

export default EditClient;
