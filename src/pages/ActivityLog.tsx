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
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <History className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold">Activity History</h1>
      </div>

      {loading ? (
        <p className="text-center py-10 font-medium">Loading records...</p>
      ) : logs.length === 0 ? (
        <p className="text-slate-500 text-center py-10 italic">Abhi tak koi activity record nahi hui.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {log.action_type === 'DELETE' ? (
                    <span className="bg-red-100 text-red-600 p-1.5 rounded-lg"><Trash2 size={16} /></span>
                  ) : (
                    <span className="bg-amber-100 text-amber-600 p-1.5 rounded-lg"><Edit3 size={16} /></span>
                  )}
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                    {log.customer_name}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {format(new Date(log.created_at), 'dd MMM, hh:mm a')}
                </span>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {log.action_type === 'DELETE' ? (
                  <p>Transaction of <span className="font-bold text-red-500 underline decoration-red-200">Rs {log.old_data?.amount}</span> was deleted.</p>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="opacity-70">Rs {log.old_data?.amount}</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="font-bold text-green-600 dark:text-green-400 text-base">Rs {log.new_data?.amount}</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded ml-1 font-bold italic uppercase">Edited</span>
                  </div>
                )}
                
                {/* Remarks Section - Jo aapko acha lag raha tha */}
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-indigo-200 dark:border-indigo-900">
                   <p className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Remarks / Detail</p>
                   <p className="text-xs italic text-slate-700 dark:text-slate-300">
                     {log.action_type === 'EDIT' ? (log.new_data?.remarks || 'No remarks added') : (log.old_data?.remarks || 'No remarks added')}
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