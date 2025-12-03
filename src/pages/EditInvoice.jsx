import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInvoice } from '../api';
import InvoiceForm from '../components/InvoiceForm';

const EditInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const response = await getInvoice(id);
      setInvoice(response.data);
    } catch (error) {
      toast.error('Error loading invoice');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Edit Invoice</h1>
      {invoice ? <InvoiceForm invoice={invoice} isEdit={true} /> : <p className="text-amber-600">Loading...</p>}
    </div>
  );
};

export default EditInvoice;
