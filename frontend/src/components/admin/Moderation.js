import React from 'react';
import { 
  AlertCircle, ShieldAlert, Eye, 
  Trash2, UserX, Flag, CheckCircle,
  MoreHorizontal, MessageSquare, Clock
} from 'lucide-react';

const Moderation = ({ reports, onResolveReport, onDismissReport }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Moderation Center</h3>
          <p className="text-sm font-medium text-gray-500">Review reported items and users to maintain community standards</p>
        </div>
        <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100">
          <AlertCircle size={18} className="text-rose-600" />
          <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
            {reports.filter(r => r.status === 'pending').length} Unresolved Reports
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:border-indigo-100 transition-all">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Report Subject */}
              <div className="flex items-center gap-4 lg:w-1/4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  report.target_type === 'user' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {report.target_type === 'user' ? <UserX size={24} /> : <Flag size={24} />}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{report.target_type} Report</span>
                  <p className="font-bold text-gray-900 truncate">ID: #{report.target_id}</p>
                </div>
              </div>

              {/* Report Reason */}
              <div className="bg-gray-50 p-4 rounded-2xl flex-1 w-full border border-gray-100">
                <div className="flex items-center gap-2 mb-1 text-gray-500">
                  <MessageSquare size={14} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Reason for report</span>
                </div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">{report.reason}</p>
              </div>

              {/* Metadata */}
              <div className="flex flex-col lg:items-end gap-2 lg:w-1/6">
                 <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                  <Clock size={12} />
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">By: {report.reporter_name}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50 lg:pl-6">
                <button 
                    onClick={() => onResolveReport(report.id)}
                    className="flex-1 lg:flex-none p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
                    title="Take Action & Resolve"
                >
                    <CheckCircle size={20} />
                </button>
                <button 
                     onClick={() => onDismissReport(report.id)}
                    className="flex-1 lg:flex-none p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                    title="Dismiss Report"
                >
                    <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-200 shadow-sm border border-emerald-50">
              <ShieldAlert size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Safe Environment</h4>
            <p className="text-gray-500 mt-1">No reported items currently require your attention</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moderation;
