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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a]">
      {/* Standard Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Activity History</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">No activity recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Minimal Icon Indicator */}
                    <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${log.action_type === 'DELETE' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>
                      {log.action_type === 'DELETE' ? <Trash2 size={16} /> : <Edit3 size={16} />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{log.customer_name}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">• {format(new Date(log.created_at), 'hh:mm a')}</span>
                      </div>

                      {/* Action Detail */}
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {log.action_type === 'DELETE' ? (
                          <span>Deleted a transaction of <span className="text-slate-900 dark:text-slate-200 font-medium">Rs {log.old_data?.amount}</span></span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Updated amount:</span>
                            <span className="line-through text-slate-300 dark:text-slate-600">Rs {log.old_data?.amount}</span>
                            <ArrowRight size={12} className="text-slate-300" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Rs {log.new_data?.amount}</span>
                          </div>
                        )}
                      </div>

                      {/* Minimal Remarks */}
                      {(log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks) && (
                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 border-l-2 border-slate-100 dark:border-slate-800 pl-3 italic">
                          "{log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-bold text-slate-400">{format(new Date(log.created_at), 'dd MMM')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;