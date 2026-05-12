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
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans">
      {/* Header - Matching Home Screen Style */}
      <div className="sticky top-0 z-10 bg-[#0b0e14]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <History className="w-5 h-5 text-indigo-500" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Activity History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-white/30 italic">Abhi tak koi activity record nahi hui.</div>
        ) : (
          <div className="grid gap-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-[#161b26] border border-white/5 p-5 rounded-[1.5rem] shadow-xl hover:bg-[#1c2230] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${log.action_type === 'DELETE' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {log.action_type === 'DELETE' ? <Trash2 size={18} /> : <Edit3 size={18} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white/90">{log.customer_name}</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        {format(new Date(log.created_at), 'dd MMM, hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    {log.action_type === 'DELETE' ? (
                      <p className="text-white/60">
                        Deleted a transaction of <span className="text-red-500 font-bold underline decoration-red-500/30 underline-offset-4">Rs {log.old_data?.amount}</span>
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 text-white/60">
                        <span className="opacity-40 line-through italic text-xs">Rs {log.old_data?.amount}</span>
                        <ArrowRight size={14} className="text-white/20" />
                        <span className="text-emerald-500 font-extrabold text-lg">Rs {log.new_data?.amount}</span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20 uppercase tracking-tighter">Updated</span>
                      </div>
                    )}
                  </div>

                  {/* Remarks - Consistent with Customer Card style */}
                  {(log.action_type === 'EDIT' ? log.new_data?.remarks : log.old_data?.remarks) && (
                    <div className="p-3 bg-black/20 rounded-xl border border-white/[0.03]">
                       <p className="text-[10px] font-bold text-white/20 uppercase mb-1 tracking-wider">Remarks</p>
                       <p className="text-xs italic text-white/50 leading-relaxed">
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
    </div>
  );
};

export default ActivityLog;