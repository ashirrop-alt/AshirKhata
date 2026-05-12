import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Apna supabase path check karlein
import { format } from 'date-fns';
import { History, Trash2, Edit3, ArrowRight } from 'lucide-react';

const ActivityLog = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold">Activity History</h1>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : logs.length === 0 ? (
        <p className="text-slate-500 text-center py-10">Abhi tak koi activity record nahi hui.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {log.action_type === 'DELETE' ? (
                    <span className="bg-red-100 text-red-600 p-1.5 rounded-lg"><Trash2 size={16} /></span>
                  ) : (
                    <span className="bg-amber-100 text-amber-600 p-1.5 rounded-lg"><Edit3 size={16} /></span>
                  )}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {log.customer_name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {format(new Date(log.created_at), 'dd MMM, hh:mm a')}
                </span>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {log.action_type === 'DELETE' ? (
                  <p>Transaction of <span className="font-semibold text-red-500">Rs {log.old_data?.amount}</span> was deleted.</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Rs {log.old_data?.amount}</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400">Rs {log.new_data?.amount}</span>
                    <span className="text-xs text-slate-400 ml-2">(Edited)</span>
                  </div>
                )}
                <p className="text-xs mt-1 italic text-slate-400">Remarks: {log.old_data?.remarks || 'No remarks'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;