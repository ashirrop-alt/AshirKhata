import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner";

// AppData ko hum yahan khud define kar dete hain taake error khatam ho jaye
interface AppData {
  shopName: string;
  customers: any[];
}

export function useKhata() {
  const [data, setData] = useState<AppData>({
    shopName: "Loading...",
    customers: []
  });

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch Shop Name from Database
    const { data: shopData } = await supabase
      .from('shops')
      .select('name')
      .eq('user_id', user.id)
      .single();

    // 2. Fetch Customers
    const { data: onlineCustomers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      const formattedCustomers = onlineCustomers?.map(c => ({
        ...c,
        transactions: c.transactions || []
      })) || [];
      
      setData({
        shopName: shopData?.name || "Meri Dukaan", // Agar DB mein nahi hai toh default
        customers: formattedCustomers
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setShopName = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Database mein save karein (Upsert matlab: agar hai toh update, nahi toh insert)
    const { error } = await supabase
      .from('shops')
      .upsert({ user_id: user.id, name: name }, { onConflict: 'user_id' });

    if (error) {
      toast.error("Shop name save nahi hua");
    } else {
      setData(prev => ({ ...prev, shopName: name }));
      toast.success("Shop name update ho gaya!");
    }
  };

  const addCustomer = async (name: string, phone: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Pehle login karein!");
    return;
  }

  const newCustomer = {
    name,
    phone,
    transactions: [],
    user_id: user.id
  };

  const { data: insertedData, error } = await supabase
    .from('customers')
    .insert([newCustomer])
    .select()
    .single();

  if (error) {
    toast.error("Database mein save nahi hua");
  } else {
    // Check karein ke kahin ye ID pehle se list mein toh nahi?
    setData(prev => {
      const exists = prev.customers.find(c => c.id === insertedData.id);
      if (exists) return prev; // Agar pehle se hai (double trigger), toh kuch na karo
      
      return {
        ...prev,
        customers: [insertedData, ...prev.customers]
      };
    });
    toast.success("Customer add ho gaya!");
  }
};

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