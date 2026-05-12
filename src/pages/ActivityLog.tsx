import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { History, Trash2, Edit3, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden">
      
      {/* Optimized Header for Alignment */}
      <header className="flex-none h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] z-30 shadow-sm px-2">
        <div className="max-w-7xl mx-auto h-full flex items-center">
          
          {/* Back Button - Pushed to the very left */}
          <button 
            onClick={() => navigate('/')} 
            className="p-2 mr-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          
          {/* Title Aligned with Shop Name Position */}
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/30">
              <History className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Activity History
            </h1>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-[#020617]">
        <div className="max-w-4xl mx-auto space-y-3">
          {loading ? (
            /* Home Style Loading */
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest">
              Abhi tak koi activity record nahi hui.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {logs.map((log) => (
                <div key={log.id} className="w-full bg-white dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 ${log.action_type === 'DELETE' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {log.action_type === 'DELETE' ? <Trash2 size={18} /> : <Edit3 size={18} />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-slate-100 text-sm md:text-base leading-tight uppercase tracking-tight">{log.customer_name}</p>
                        <p className="text-[9px] font-black text-slate-400 mt-0.5 uppercase tracking-widest">
                          {format(new Date(log.created_at), 'dd MMM • hh:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pl-[52px]">
                    <div className="text-sm font-black tracking-tight">
                      {log.action_type === 'DELETE' ? (
                        <p className="text-slate-500 dark:text-white/40 uppercase">Deleted <span className="text-rose-500">Rs {log.old_data?.amount.toLocaleString()}</span></p>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-white/40">
                          <span className="opacity-40 line-through text-xs italic">Rs {log.old_data?.amount.toLocaleString()}</span>
                          <ArrowRight size={12} className="text-slate-300" />
                          <span className="text-emerald-600 dark:text-emerald-400 text-base font-black">Rs {log.new_data?.amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Compact Remarks Text Line */}
                    {(log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks) && (
                      <p className="mt-1 text-[10px] font-bold italic text-slate-400 dark:text-white/20 border-l-2 border-slate-200 dark:border-white/5 pl-2 leading-tight">
                        "{log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivityLog;