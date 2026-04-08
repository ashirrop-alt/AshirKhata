import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKhata } from "@/hooks/useKhata";
import { HomeScreen } from "@/components/HomeScreen";
import { CustomerDetail } from "@/components/CustomerDetail";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    data, 
    isLoading, 
    setShopName, 
    addCustomer, 
    deleteCustomer, 
    addTransaction, 
    deleteTransaction 
  }: any = useKhata();

  const [addOpen, setAddOpen] = useState(false);

  const selectedCustomer = data.customers.find((c: any) => String(c.id) === id);

  const handleSelectCustomer = (customerId: any) => {
    navigate(`/customer/${customerId}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  // Main wrapper jo poori screen ko control karega aur bahar ka scroll rokay ga
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50">
      {selectedCustomer ? (
        <CustomerDetail
          customer={selectedCustomer}
          onBack={handleBack}
          onAddTransaction={addTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      ) : (
        <HomeScreen
          shopName={data.shopName}
          customers={data.customers}
          isLoading={isLoading} 
          onSetShopName={setShopName}
          onSelectCustomer={handleSelectCustomer}
          onAddCustomer={() => setAddOpen(true)}
        />
      )}
      
      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addCustomer}
      />
    </div>
  );
};

export default Index;