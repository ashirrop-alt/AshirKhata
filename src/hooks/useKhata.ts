import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner";

interface AppData {
  shopName: string;
  customers: any[];
}

export function useKhata() {
  const [data, setData] = useState<AppData>({
    shopName: "", 
    customers: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // 1. Fetch Shop Name
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (shopError) throw shopError;

      // 2. Fetch Customers
      const { data: onlineCustomers, error: custError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (custError) throw custError;

      setData({
        shopName: shopData?.name || "", 
        customers: onlineCustomers || []
      });

    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Data load nahi ho saka. Connection check karein.");
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
      toast.error("Dukaan ka naam save nahi ho saka");
    } else {
      setData(prev => ({ ...prev, shopName: name }));
      toast.success("Dukaan ka naam update ho gaya! ✨");
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
      toast.error("Customer save nahi ho saka. Dobara koshish karein.");
    } else {
      setData(prev => ({
        ...prev,
        customers: [insertedData, ...prev.customers]
      }));
      toast.success(`${name} ka khata shuru ho gaya! ✅`);
    }
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      toast.error("Delete nahi ho saka");
    } else {
      setData(prev => ({
        ...prev,
        customers: prev.customers.filter(c => c.id !== id)
      }));
      toast.info("Customer delete ho gaya");
    }
  };

  return { 
    data, 
    isLoading, 
    setShopName, 
    addCustomer, 
    deleteCustomer,
    refreshData: fetchData 
  };
}