import { useState, useEffect, useCallback } from "react";
import { AppData, Customer, loadData, saveData, generateId } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useKhata() {
  const [data, setData] = useState<AppData>({
    shopName: localStorage.getItem("shopName") || "",
    customers: []
  });

  // 1. Fetch Data Function (Ab ye scope se bahar hai)
  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: onlineCustomers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    if (onlineCustomers) {
      // Transactions ko sahi format mein handle karna
      const formattedCustomers = onlineCustomers.map(c => ({
        ...c,
        transactions: c.transactions || []
      }));
      
      setData(prev => ({ ...prev, customers: formattedCustomers }));
      saveData({ ...data, customers: formattedCustomers });
    }
  }, []);

  // 2. Load on Mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setShopName = (name: string) => {
    localStorage.setItem("shopName", name);
    setData(prev => ({ ...prev, shopName: name }));
  };

  const addCustomer = async (name: string, phone: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Pehle login karein!");
      return;
    }

    const newCustomer = {
      id: generateId(),
      name,
      phone,
      transactions: [],
      user_id: user.id
    };

    const { error } = await supabase.from('customers').insert([newCustomer]);

    if (error) {
      toast.error("Database mein save nahi hua");
    } else {
      setData(prev => ({
        ...prev,
        customers: [newCustomer, ...prev.customers]
      }));
      toast.success("Customer add ho gaya!");
    }
  };

  // Delete Customer
  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) {
      setData(prev => ({
        ...prev,
        customers: prev.customers.filter(c => c.id !== id)
      }));
      toast.success("Customer delete ho gaya");
    }
  };

  return { 
    data, 
    setShopName, 
    addCustomer, 
    deleteCustomer,
    refreshData: fetchData 
  };
}