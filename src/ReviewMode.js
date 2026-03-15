import React, { useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Search, FileText, AlertCircle, ChevronLeft, MapPin, Calendar, Clock } from 'lucide-react';

const ReviewMode = ({ onBack }) => {
    const [searchId, setSearchId] = useState('');
    const [surveyData, setSurveyData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setIsLoading(true);
        setError('');
        setSurveyData(null);

        try {
            // Logic: First try searching by custom surveyId, then by Firestore Doc ID
            const q = query(collection(db, "surveys"), where("surveyId", "==", searchId.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Found via custom surveyId
                setSurveyData(querySnapshot.docs[0].data());
            } else {
                // Try searching via Firestore Document ID directly
                const docRef = doc(db, "surveys", searchId.trim());
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSurveyData(docSnap.data());
                } else {
                    setError("No record found with that ID. Please check the ID and try again.");
                }
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to reach the database. Check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button onClick={onBack} className="flex items-center gap-2 text-teal-700 font-bold mb-8 hover:opacity-70">
                    <ChevronLeft size={20} /> Back to Surveyor
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Record Retrieval</h2>
                    <p className="text-slate-500 mb-8">Enter a Survey ID or Document ID to pull historical records from the cloud.</p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-5 text-slate-400" size={20} />
                            <input
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Ex: RBSK-20260214-A7B9"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-teal-500/10 outline-none font-bold text-slate-800"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50"
                        >
                            {isLoading ? "Fetching..." : "Search"}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 mb-8">
                            <AlertCircle /> <span className="font-bold">{error}</span>
                        </div>
                    )}

                    {/* Survey Results Display */}
                    {surveyData && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <div className="border-b border-slate-100 pb-8 mb-8 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">{surveyData.childName}</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-400 font-bold">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {surveyData.district}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {surveyData.ageDisplay}</span>
                                    </div>
                                </div>
                                <div className={`px-6 py-3 rounded-2xl font-black text-sm ${surveyData.redFlagsCount > 0 ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}>
                                    {surveyData.redFlagsCount} RED FLAGS
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 p-6 rounded-3xl">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Clinical Summary</h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between text-sm font-bold"><span>Anemia:</span> <span className={surveyData.anemia === 'Yes' ? 'text-red-500' : ''}>{surveyData.anemia}</span></li>
                                        <li className="flex justify-between text-sm font-bold"><span>SAM:</span> <span className={surveyData.sam === 'Yes' ? 'text-red-500' : ''}>{surveyData.sam}</span></li>
                                        <li className="flex justify-between text-sm font-bold"><span>Vision Diff:</span> <span>{surveyData.visionDiff || 'N/A'}</span></li>
                                    </ul>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Referral Status</h4>
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="text-teal-600" size={18} />
                                        <span className="text-sm font-bold">Referred: {surveyData.referred}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Place: {surveyData.referralPlace || 'No referral noted'}</p>
                                </div>
                            </div>

                            {surveyData.gapsIdentified && (
                                <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                    <h4 className="text-[10px] font-black uppercase text-amber-600 mb-2 tracking-widest">Surveyor Observations</h4>
                                    <p className="text-sm text-amber-900 font-medium leading-relaxed">{surveyData.gapsIdentified}</p>
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