import React from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle, 
  Trash2, UserX, Flag, Clock, MessageSquare
} from 'lucide-react';

const ReportsManagement = ({ reports = [], onResolveReport, onDismissReport }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Reports Control</h3>
          <p className="text-sm font-medium text-gray-500">Respond to community reports regarding items and user behavior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:border-rose-100 transition-all">
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
                  <p className="font-bold text-gray-900 truncate">Target ID: #{report.target_id}</p>
                </div>
              </div>

              {/* Report Reason */}
              <div className="bg-gray-50 p-4 rounded-2xl flex-1 w-full border border-gray-100">
                <div className="flex items-center gap-2 mb-1 text-gray-400">
                  <MessageSquare size={14} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Issue stated</span>
                </div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">{report.reason}</p>
              </div>

              {/* Metadata */}
              <div className="flex flex-col lg:items-end gap-2 lg:w-1/6">
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                  <Clock size={12} />
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">By: {report.reporter_name}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full lg:w-auto">
                <button 
                  onClick={() => onResolveReport && onResolveReport(report.id)}
                  className="flex-1 lg:flex-none p-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all"
                  title="Resolve"
                >
                  <CheckCircle size={20} />
                </button>
                <button 
                  onClick={() => onDismissReport && onDismissReport(report.id)}
                  className="flex-1 lg:flex-none p-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all"
                  title="Dismiss"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-200">
              <ShieldAlert size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 tracking-tight">System Status: Secure</h4>
            <p className="text-gray-500 mt-1 max-w-xs mx-auto text-sm">No community reports have been submitted at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManagement;
