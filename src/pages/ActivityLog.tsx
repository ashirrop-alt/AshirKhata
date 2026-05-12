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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500">
      
      {/* HEADER - Consistent with HomeScreen.tsx */}
      <header className="flex-none h-16 md:h-[68px] border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0f172a] px-4 md:px-6 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto h-full flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 group active:scale-95 transition-all text-left"
          >
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-700 transition-colors">
              <ArrowLeft className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              Activity History
            </h1>
          </button>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50 dark:bg-[#020617]">
        <div className="max-w-4xl mx-auto space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
               <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading History...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-bold text-[12px] uppercase tracking-widest">
              No activity found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {logs.map((log) => (
                <div key={log.id} className="w-full bg-white dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200 dark:border-white/10 hover:border-indigo-300/50 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm relative overflow-hidden group">
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4"> {/* Increased Gap */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 ${log.action_type === 'DELETE' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {log.action_type === 'DELETE' ? <Trash2 size={18} /> : <Edit3 size={18} />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-slate-100 text-sm md:text-base leading-tight uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                          {log.customer_name}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-widest">
                          {format(new Date(log.created_at), 'dd MMM • hh:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pl-[56px]"> {/* Adjusted for more gap */}
                    <div className="text-sm font-black tracking-tight flex items-center gap-3">
                      {log.action_type === 'DELETE' ? (
                        <p className="text-slate-500 dark:text-white/40">Hisaab delete kiya: <span className="text-rose-500">Rs {log.old_data?.amount.toLocaleString()}</span></p>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 dark:text-white/20 line-through text-xs italic">Rs {log.old_data?.amount.toLocaleString()}</span>
                          <ArrowRight size={12} className="text-slate-300 dark:text-white/10" />
                          <span className="text-emerald-600 dark:text-emerald-400 text-base font-black">Rs {log.new_data?.amount.toLocaleString()}</span>
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20 uppercase tracking-tighter ml-1 font-black shadow-sm">
                            Edited
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CLEANER TAFSEEL LINE */}
                    {(log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks) && (
                      <div className="mt-2 flex items-center gap-2 border-t border-slate-100 dark:border-white/5 pt-2">
                        <span className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-tighter">Tafseel:</span>
                        <p className="text-[11px] font-medium italic text-slate-500 dark:text-white/40 leading-none">
                          {log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks}
                        </p>
                      </div>
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