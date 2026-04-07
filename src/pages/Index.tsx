import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKhata } from "@/hooks/useKhata";
import { HomeScreen } from "@/components/HomeScreen";
import { CustomerDetail } from "@/components/CustomerDetail";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, setShopName, addCustomer, deleteCustomer, addTransaction, deleteTransaction }: any = useKhata();
  const [addOpen, setAddOpen] = useState(false);

  // URL wali ID ke mutabiq customer dhundo
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
        // In dono functions ko CustomerDetail ab accept karega
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
        onSetShopName={setShopName}
        onSelectCustomer={handleSelectCustomer}
        onAddCustomer={() => setAddOpen(true)}
      />
      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addCustomer}
      />
    </>
  );
};

export default Index;