import { supabase } from './supabase';

export interface Transaction {
  id: string;
  type: "udhar" | "payment";
  amount: number;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  transactions: Transaction[];
}

export interface AppData {
  shopName: string;
  customers: Customer[];
}

const STORAGE_KEY = "udhar-khata-data";

// Ye function HomeScreen ke liye zaroori hai
export function getCustomerTotal(customer: Customer): number {
  return customer.transactions.reduce((sum, t) => {
    return t.type === "udhar" ? sum + t.amount : sum - t.amount;
  }, 0);
}

export function getTotalUdhar(customers: Customer[]): number {
  return customers.reduce((sum, c) => sum + getCustomerTotal(c), 0);
}

// Supabase Functions
export async function loadDataOnline(): Promise<Customer[]> {
  const { data, error } = await supabase.from('customer').select('*');
  if (error) return [];
  return data || [];
}

export async function syncCustomerOnline(customer: Customer) {
  await supabase.from('customer').upsert({ 
    id: customer.id, 
    name: customer.name, 
    phone: customer.phone, 
    transactions: customer.transactions 
  });
}

// Local Storage Functions
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { shopName: "", customers: [] };
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}