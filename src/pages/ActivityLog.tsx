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
    <div className="min-h-screen bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-white font-sans">
      {/* Header - 100% Matching HomeScreen.tsx */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b0e14]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 text-slate-600 dark:text-white/70"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Title exactly where Shop Name appears */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                  System Logs
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Activity History
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-white/20 italic font-bold text-sm">
            Abhi tak koi activity record nahi hui.
          </div>
        ) : (
          <div className="grid gap-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-slate-50 dark:bg-[#161b26] border border-slate-200 dark:border-white/5 p-4 rounded-[1.5rem] shadow-sm hover:shadow-md dark:hover:bg-[#1c2230] transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${log.action_type === 'DELETE' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {log.action_type === 'DELETE' ? <Trash2 size={16} /> : <Edit3 size={16} />}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white/90 leading-none">{log.customer_name}</h3>
                      <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-black mt-1">
                        {format(new Date(log.created_at), 'dd MMM • hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-bold">
                    {log.action_type === 'DELETE' ? (
                      <p className="text-slate-500 dark:text-white/50">
                        Deleted <span className="text-red-500">Rs {log.old_data?.amount}</span>
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-white/50">
                        <span className="opacity-40 line-through text-xs italic">Rs {log.old_data?.amount}</span>
                        <ArrowRight size={12} className="opacity-20" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">Rs {log.new_data?.amount}</span>
                      </div>
                    )}
                  </div>

                  {/* Remarks - Mazeed Compact aur Chota */}
                  {(log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks) && (
                    <div className="py-1.5 px-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/[0.03]">
                       <p className="text-[10px] italic text-slate-500 dark:text-white/40 leading-snug">
                         "{log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks}"
                       </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActivityLog;