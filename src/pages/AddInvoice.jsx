import InvoiceForm from '../components/InvoiceForm';

const AddInvoice = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Add New Invoice</h1>
      <InvoiceForm />
    </div>
  );
};

export default AddInvoice;
