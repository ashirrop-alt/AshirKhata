import { useState, useEffect } from "react";
import { AppData, Customer, Transaction, loadData, saveData, generateId, syncCustomerOnline } from "@/lib/store";
import { supabase } from "@/lib/supabase"; // <--- Yeh line missing thi
import { toast } from "sonner";

export function useKhata() {
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    const fetchData = async () => {
      // User ki current session check karein
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Sirf is user ka data mangwayein
      const { data: onlineCustomers, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && onlineCustomers) {
        const newData = { ...data, customers: onlineCustomers };
        setData(newData);
        saveData(newData);
      }
    };

    fetchData();
  }, []);

  const setShopName = (name: string) => {
    const newData = { ...data, shopName: name };
    setData(newData);
    saveData(newData);
  };

  const addCustomer = async (name: string, phone: string) => {
    const newCustomer: Customer = { id: generateId(), name, phone, transactions: [] };
    const newData = { ...data, customers: [...data.customers, newCustomer] };
    setData(newData);
    saveData(newData);
    await syncCustomerOnline(newCustomer);
    toast.success("Customer save ho gaya!");
  };

  const deleteCustomer = (id: string) => {
    const newData = { ...data, customers: data.customers.filter(c => c.id !== id) };
    setData(newData);
    saveData(newData);
  };

  const addTransaction = async (customerId: string, type: "udhar" | "payment", amount: number) => {
    const newTransaction: Transaction = {
      id: generateId(),
      type,
      amount,
      date: new Date().toISOString(),
    };
    const updatedCustomers = data.customers.map((c) => {
      if (c.id === customerId) {
        const updated = { ...c, transactions: [newTransaction, ...c.transactions] };
        syncCustomerOnline(updated);
        return updated;
      }
      return c;
    });
    const newData = { ...data, customers: updatedCustomers };
    setData(newData);
    saveData(newData);
  };

  const deleteTransaction = (customerId: string, transactionId: string) => {
    const updatedCustomers = data.customers.map((c) => {
      if (c.id === customerId) {
        const updated = { ...c, transactions: c.transactions.filter(t => t.id !== transactionId) };
        syncCustomerOnline(updated);
        return updated;
      }
      return c;
    });
    const newData = { ...data, customers: updatedCustomers };
    setData(newData);
    saveData(newData);
  };

  return { data, setData, setShopName, addCustomer, deleteCustomer, addTransaction, deleteTransaction };
}