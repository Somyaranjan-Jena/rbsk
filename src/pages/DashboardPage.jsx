import React, { useState, useEffect } from 'react';
import {
  BarChart3, ClipboardList, Activity, CheckCircle2,
  AlertTriangle, TrendingUp, Users, Loader2, RefreshCw, MapPin
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { FLAG_LABELS } from '../utils/helpers';

const DashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [deicCases, setDeicCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [surveySnap, caseSnap] = await Promise.all([
        getDocs(query(collection(db, 'surveys'), orderBy('submittedAt', 'desc'), limit(200))),
        getDocs(query(collection(db, 'deic_cases'), orderBy('submittedAt', 'desc'), limit(200))),
      ]);
      setSurveys(surveySnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDeicCases(caseSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error('Dashboard fetch error:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const totalSurveys = surveys.length;
  const totalCases = deicCases.length;
  const flaggedSurveys = surveys.filter(s => (s.redFlagsCount || 0) > 0).length;
  const flagRate = totalSurveys > 0 ? Math.round((flaggedSurveys / totalSurveys) * 100) : 0;
  const dischargedCount = deicCases.filter(c => c.sum_outcome === 'Discharged – Goals Met').length;
  const dischargeRate = totalCases > 0 ? Math.round((dischargedCount / totalCases) * 100) : 0;
  const activeTherapy = deicCases.filter(c => c.sum_outcome === 'Active – Ongoing Therapy').length;
  const pendingVisit = deicCases.filter(c => !c.sum_outcome || c.sum_outcome === 'Pending First Visit').length;
  const lostFollowUp = deicCases.filter(c => c.sum_outcome === 'Lost to Follow-up').length;

  const districtMap = {};
  surveys.forEach(s => {
    const d = s.district || 'Unknown';
    if (!districtMap[d]) districtMap[d] = { surveys: 0, flags: 0 };
    districtMap[d].surveys++;
    if ((s.redFlagsCount || 0) > 0) districtMap[d].flags++;
  });
  const districts = Object.entries(districtMap).sort((a, b) => b[1].surveys - a[1].surveys).slice(0, 10);

  const conditionCount = {};
  surveys.forEach(s => {
    Object.keys(FLAG_LABELS).forEach(k => { if (s[k] === 'Yes') conditionCount[k] = (conditionCount[k] || 0) + 1; });
  });
  const topConditions = Object.entries(conditionCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCondCount = topConditions.length > 0 ? topConditions[0][1] : 1;

  const statusMap = {};
  deicCases.forEach(c => { const s = c.sum_outcome || 'Pending First Visit'; statusMap[s] = (statusMap[s] || 0) + 1; });
  const statusColors = {
    'Active – Ongoing Therapy': 'bg-teal-500', 'Referred Tertiary': 'bg-blue-500',
    'Discharged – Goals Met': 'bg-emerald-500', 'Lost to Follow-up': 'bg-red-500',
    'Pending First Visit': 'bg-amber-500', 'Deceased': 'bg-slate-400',
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
      <Loader2 size={40} className="animate-spin mb-4" />
      <p className="font-bold text-sm">Loading analytics…</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-12 page-enter space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <BarChart3 size={28} className="text-teal-600" /> Dashboard
          </h2>
          <p className="text-slate-400 text-sm font-semibold mt-1">Analytics overview for your RBSK program</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-slate-100/80 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all hover:rotate-180 duration-500" title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Surveys', value: totalSurveys, icon: ClipboardList, color: 'from-teal-50 to-emerald-50', text: 'text-teal-700' },
          { label: 'DEIC Cases', value: totalCases, icon: Users, color: 'from-blue-50 to-indigo-50', text: 'text-blue-700' },
          { label: 'Flag Rate', value: `${flagRate}%`, icon: AlertTriangle, color: flagRate > 30 ? 'from-red-50 to-rose-50' : 'from-amber-50 to-orange-50', text: flagRate > 30 ? 'text-red-700' : 'text-amber-700' },
          { label: 'Discharge Rate', value: `${dischargeRate}%`, icon: CheckCircle2, color: 'from-emerald-50 to-green-50', text: 'text-emerald-700' },
        ].map(s => (
          <div key={s.label} className={`card-elevated bg-gradient-to-br ${s.color} p-5 ${s.text}`}>
            <s.icon size={20} className="mb-3 opacity-60" />
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card-elevated p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-5">Case Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(statusMap).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">{status.split(' – ')[0]}</span>
                  <span className="text-slate-900">{count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full transition-all duration-700 ${statusColors[status] || 'bg-slate-400'}`}
                    style={{ width: `${totalCases > 0 ? (count / totalCases) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="bg-teal-50 rounded-xl p-3"><p className="text-xl font-black text-teal-700">{activeTherapy}</p><p className="text-[9px] font-extrabold text-teal-500 uppercase">Active</p></div>
            <div className="bg-amber-50 rounded-xl p-3"><p className="text-xl font-black text-amber-700">{pendingVisit}</p><p className="text-[9px] font-extrabold text-amber-500 uppercase">Pending</p></div>
            <div className="bg-red-50 rounded-xl p-3"><p className="text-xl font-black text-red-700">{lostFollowUp}</p><p className="text-[9px] font-extrabold text-red-500 uppercase">Lost</p></div>
          </div>
        </div>

        {/* Top Flagged */}
        <div className="card-elevated p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-5">
            <TrendingUp size={14} className="inline mr-2 -mt-0.5 text-red-500" /> Top Flagged Conditions
          </h3>
          {topConditions.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium text-center py-8">No flagged conditions yet.</p>
          ) : (
            <div className="space-y-3">
              {topConditions.map(([key, count]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">{FLAG_LABELS[key] || key}</span>
                    <span className="text-red-600">{count}</span>
                  </div>
                  <div className="w-full bg-red-50 rounded-full h-2 overflow-hidden">
                    <div className="h-2 rounded-full bg-gradient-to-r from-red-400 to-rose-500 transition-all duration-700"
                      style={{ width: `${(count / maxCondCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* District Breakdown */}
      {districts.length > 0 && (
        <div className="card-elevated p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <MapPin size={14} className="text-teal-500" /> District Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest">District</th>
                  <th className="text-right py-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Surveys</th>
                  <th className="text-right py-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Flagged</th>
                  <th className="text-right py-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Flag %</th>
                </tr>
              </thead>
              <tbody>
                {districts.map(([name, data]) => (
                  <tr key={name} className="border-b border-slate-50 hover:bg-teal-50/30 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{name}</td>
                    <td className="py-3 text-right font-bold text-slate-600">{data.surveys}</td>
                    <td className="py-3 text-right font-bold text-red-600">{data.flags}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${(data.flags / data.surveys) > 0.3 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {Math.round((data.flags / data.surveys) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Surveys */}
      <div className="card-elevated p-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-5">Recent Surveys</h3>
        {surveys.slice(0, 5).length === 0 ? (
          <p className="text-sm text-slate-400 font-medium text-center py-6">No surveys submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {surveys.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-4 p-3 bg-slate-50/60 rounded-2xl hover:bg-slate-100/60 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm ${
                  (s.redFlagsCount || 0) > 0 ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-teal-400 to-teal-600'}`}>
                  {(s.childName || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{s.childName || 'Unnamed'}</p>
                  <p className="text-xs text-slate-400 font-medium">{s.district || '—'} · {s.ageDisplay || '—'}</p>
                </div>
                {(s.redFlagsCount || 0) > 0 && (
                  <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-lg">{s.redFlagsCount} flags</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
