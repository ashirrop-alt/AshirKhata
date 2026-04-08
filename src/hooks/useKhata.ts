import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner";

interface AppData {
  shopName: string;
  customers: any[];
}

export function useKhata() {
  const [data, setData] = useState<AppData>({
    shopName: "", // Initial empty rakhein
    customers: []
  });
  
  // Naya loading state: Ye track karega ke data fetch ho raha hai ya nahi
  const [isLoading, setIsLoading] = useState(true);

  // useKhata.ts mein sirf ye fetch wala hissa update karein
const fetchData = useCallback(async () => {
  setIsLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    // 1. Shop name fetch karein (maybeSingle zaroori hai)
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('name')
      .eq('user_id', user.id)
      .maybeSingle();

    // 2. Customers fetch karein
    const { data: onlineCustomers, error: custError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!shopError && !custError) {
      setData({
        // Yahan ensure karein ke agar shopData null hai toh "" jaye
        shopName: shopData?.name || "", 
        customers: onlineCustomers || []
      });
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setShopName = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
      setData(prev => {
        const exists = prev.customers.find(c => c.id === insertedData.id);
        if (exists) return prev;
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
    isLoading, // Isay return karna zaroori hai taake UI mein check kar sakein
    setShopName, 
    addCustomer, 
    deleteCustomer,
    refreshData: fetchData 
  };
}