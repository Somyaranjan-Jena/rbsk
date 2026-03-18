import React, { useState } from 'react';
import { db } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import { Search, FileText, AlertCircle, ChevronLeft, MapPin, Calendar, Loader2, Link2, Printer } from 'lucide-react';
import { printReport } from './utils/printReport';

const ReviewMode = ({ onBack, onOpenDEIC }) => {
    const [searchId, setSearchId] = useState('');
    const [surveyData, setSurveyData] = useState(null);
    const [sourceType, setSourceType] = useState(''); // 'survey' | 'deic'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = searchId.trim().toUpperCase();
        if (!trimmed) return;

        setIsLoading(true);
        setError('');
        setSurveyData(null);
        setSourceType('');

        try {
            // Try surveys collection first (RBSK- prefix or unknown)
            if (!trimmed.startsWith('DEIC-')) {
                const surveySnap = await getDoc(doc(db, 'surveys', trimmed));
                if (surveySnap.exists()) {
                    setSurveyData(surveySnap.data());
                    setSourceType('survey');
                    return;
                }
            }

            // Try deic_cases collection (DEIC- prefix or fallback)
            const deicSnap = await getDoc(doc(db, 'deic_cases', trimmed));
            if (deicSnap.exists()) {
                const d = deicSnap.data();
                // Map DEIC fields to the display format
                setSurveyData({
                    childName:      d.deic_childName,
                    district:       d.deic_district,
                    ageDisplay:     d.deic_age,
                    redFlagsCount:  d.redFlagsCount,
                    anemia:         d.anemia,
                    sam:            d.sam,
                    visionDiff:     d.visionDiff,
                    hearingDiff:    d.hearingDiff,
                    speechDelay:    d.speechDelay,
                    referred:       d.referred,
                    referralPlace:  d.referralPlace,
                    category:       d.sum_primaryDx,
                    gapsIdentified: d.gapsIdentified,
                    linkedId:       d.rbsk_surveyId,  // bidirectional link back to survey
                });
                setSourceType('deic');
                return;
            }

            // Nothing found in either collection
            setError('No record found with that ID. Please check the ID and try again.');
        } catch (err) {
            console.error('Fetch error:', err);
            if (!navigator.onLine) {
                setError('Network unavailable. Please check your internet connection.');
            } else if (err.code === 'permission-denied') {
                setError('Permission denied. Please check authentication.');
            } else {
                setError('Failed to reach the database. Check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-[#f0fdf9]/20 to-[#f8fafb] p-6 font-sans print-page">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button onClick={onBack} className="print-hide flex items-center gap-2 text-teal-700 font-extrabold mb-8 hover:opacity-70 transition-all">
                    <ChevronLeft size={20} /> Back to Surveyor
                </button>

                <div className="card-elevated p-8 md:p-12 animate-fade-in">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Record Retrieval</h2>
                    <p className="text-slate-500 mb-8 font-medium">Enter a Survey ID or DEIC ID to pull historical records from the cloud.</p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="print-hide flex gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-4 text-slate-400" size={20} />
                            <input
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Ex: RBSK-20260318-A7B9  or  DEIC-20260318-C3F1"
                                className="input-premium pl-14 py-4"
                            />
                        </div>
                        <button type="submit" disabled={isLoading || !searchId.trim()}
                            className="btn-primary px-8 py-4 disabled:opacity-50">
                            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Searching…</> : 'Search'}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 mb-8 animate-fade-in">
                            <AlertCircle size={20} /> <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    {/* Skeleton Loader */}
                    {isLoading && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="skeleton h-8 w-48" />
                            <div className="skeleton h-4 w-64" />
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="skeleton h-32 rounded-2xl" />
                                <div className="skeleton h-32 rounded-2xl" />
                            </div>
                        </div>
                    )}

                    {/* Survey Results Display */}
                    {surveyData && (
                        <div className="page-enter">

                            {/* ── PRINT-ONLY REPORT HEADER ── hidden on screen ── */}
                            <div className="print-header hidden border-b-2 border-slate-800 pb-6 mb-8">
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                    <div>
                                        <p style={{fontSize:'9pt', fontWeight:800, letterSpacing:'0.12em', color:'#0d9488', textTransform:'uppercase', marginBottom:'4pt'}}>Government of India · Ministry of Health &amp; Family Welfare</p>
                                        <h1 style={{fontSize:'20pt', fontWeight:900, color:'#0f172a', margin:'0 0 2pt 0', lineHeight:1.1}}>RBSK Field Survey Report</h1>
                                        <p style={{fontSize:'9pt', color:'#64748b', fontWeight:600}}>Rashtriya Bal Swasthya Karyakram — Child Health Screening Record</p>
                                    </div>
                                    <div style={{textAlign:'right', fontSize:'8pt', color:'#475569', fontWeight:600}}>
                                        <p style={{marginBottom:'2pt'}}>Printed: {new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}</p>
                                        {surveyData.surveyId && <p>Survey ID: <strong style={{fontFamily:'monospace'}}>{surveyData.surveyId}</strong></p>}
                                        {surveyData.deicId   && <p>DEIC ID: <strong style={{fontFamily:'monospace'}}>{surveyData.deicId}</strong></p>}
                                        {surveyData.linkedId && <p>Survey ID: <strong style={{fontFamily:'monospace'}}>{surveyData.linkedId}</strong></p>}
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-slate-100 pb-8 mb-8 flex justify-between items-start print-section">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">{surveyData.childName || 'Unnamed Child'}</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-400 font-semibold">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {surveyData.district || 'Unknown'}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {surveyData.ageDisplay || '—'}</span>
                                    </div>
                                    {/* Linked ID badge */}
                                    {(surveyData.deicId || surveyData.linkedId) && (
                                        <div className="flex items-center gap-2 mt-3 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl w-fit">
                                            <Link2 size={12} />
                                            {sourceType === 'survey'
                                                ? <>DEIC ID: <span className="font-mono">{surveyData.deicId}</span></>
                                                : <>Survey ID: <span className="font-mono">{surveyData.linkedId}</span></>
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className={`px-6 py-3 rounded-2xl font-extrabold text-sm ${
                                        surveyData.redFlagsCount > 0
                                            ? 'bg-gradient-to-br from-red-100 to-rose-100 text-red-600 border border-red-200'
                                            : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 border border-emerald-200'
                                    }`}>
                                        {surveyData.redFlagsCount ?? 0} RED FLAGS
                                    </div>
                                    <button
                                        onClick={() => printReport(surveyData)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all"
                                    >
                                        <Printer size={14} /> Print
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-3xl border border-slate-100 print-section">
                                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-4 tracking-widest">Clinical Summary</h4>
                                    <ul className="space-y-3">
                                        {[
                                            ['Anemia', surveyData.anemia],
                                            ['SAM', surveyData.sam],
                                            ['Vision Diff', surveyData.visionDiff],
                                            ['Hearing Diff', surveyData.hearingDiff],
                                            ['Speech Delay', surveyData.speechDelay],
                                        ].map(([label, val]) => (
                                            <li key={label} className="flex justify-between text-sm font-semibold">
                                                <span className="text-slate-600">{label}:</span>
                                                <span className={val === 'Yes' ? 'text-red-500 font-extrabold' : 'text-slate-800'}>{val || 'N/A'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-3xl border border-slate-100 print-section">
                                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-4 tracking-widest">Referral Status</h4>
                                    <div className="flex items-center gap-3 mb-3">
                                        <FileText className="text-teal-600" size={18} />
                                        <span className="text-sm font-bold">Referred: {surveyData.referred || 'N/A'}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-4">Place: {surveyData.referralPlace || 'No referral noted'}</p>
                                    {surveyData.category && (
                                        <div className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-2 text-xs font-bold text-teal-700">
                                            Category: {surveyData.category}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {surveyData.gapsIdentified && (
                                <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-3xl border border-amber-100">
                                    <h4 className="text-[10px] font-extrabold uppercase text-amber-600 mb-2 tracking-widest">Surveyor Observations</h4>
                                    <p className="text-sm text-amber-900 font-medium leading-relaxed">{surveyData.gapsIdentified}</p>
                                </div>
                            )}

                            {/* Open Case Sheet button — hidden when printing */}
                            {onOpenDEIC && (
                                <div className="print-hide mt-8 p-6 bg-gradient-to-r from-teal-900 to-teal-950 text-white rounded-3xl flex items-center justify-between gap-6 shadow-lg">
                                    <div>
                                        <p className="font-black text-sm flex items-center gap-2">
                                            <FileText size={16} className="text-teal-300" />
                                            Open DEIC Digital Case Sheet
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onOpenDEIC({
                                            childName:  surveyData.childName,
                                            dob:        surveyData.dob,
                                            ageDisplay: surveyData.ageDisplay,
                                            district:   surveyData.district,
                                            sex:        surveyData.sex,
                                            surveyId:   surveyData.surveyId || surveyData.linkedId,
                                        })}
                                        className="shrink-0 flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-2xl font-extrabold text-sm hover:bg-teal-50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <FileText size={16} /> Open
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewMode;