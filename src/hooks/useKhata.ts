import { useState, useEffect } from "react";
import { AppData, Customer, Transaction, loadData, saveData, generateId, syncCustomerOnline, loadDataOnline } from "@/lib/store";
import { toast } from "sonner";

export function useKhata() {
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    async function fetchData() {
      const onlineCustomers = await loadDataOnline();
      if (onlineCustomers.length > 0) {
        const newData = { ...data, customers: onlineCustomers };
        setData(newData);
        saveData(newData);
      }
    }
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