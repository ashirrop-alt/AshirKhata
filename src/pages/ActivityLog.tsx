import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { History, Trash2, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityLog = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex items-center gap-2">
          <History className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Activity History</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Abhi tak koi activity record nahi hui.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${log.action_type === 'DELETE' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                    {log.action_type === 'DELETE' ? <Trash2 size={18} /> : <Edit3 size={18} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{log.customer_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                      {log.action_type === 'DELETE' ? (
                        <span className="text-red-500/80 font-medium italic underline decoration-red-200">Record Deleted</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="line-through opacity-50">Rs {log.old_data?.amount}</span>
                          <ArrowRight size={12} />
                          <span className="font-bold text-emerald-600">Rs {log.new_data?.amount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    {format(new Date(log.created_at), 'dd MMM')}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {format(new Date(log.created_at), 'hh:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;