import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKhata } from "@/hooks/useKhata";
import { HomeScreen } from "@/components/HomeScreen";
import { CustomerDetail } from "@/components/CustomerDetail";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Yahan isLoading ko bhi add kar diya hai
  const { 
    data, 
    isLoading, // Ye zaroori tha
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

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={handleBack}
        onAddTransaction={addTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    );
  }

  return (
    <>
      <HomeScreen
        shopName={data.shopName}
        customers={data.customers}
        isLoading={isLoading} 
        onSetShopName={setShopName}
        onSelectCustomer={handleSelectCustomer}
        onAddCustomer={() => setAddOpen(true)}
      /> {/* Yahan tag sahi se band kar diya hai */}
      
      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addCustomer}
      />
    </>
  );
};

export default Index;