import { useState } from "react";
import { useKhata } from "@/hooks/useKhata";
import { HomeScreen } from "@/components/HomeScreen";
import { CustomerDetail } from "@/components/CustomerDetail";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

const Index = () => {
  const { data, setShopName, addCustomer, deleteCustomer, addTransaction, deleteTransaction } = useKhata();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const selectedCustomer = data.customers.find(c => c.id === selectedId);

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedId(null)}
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
        onSelectCustomer={setSelectedId}
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
