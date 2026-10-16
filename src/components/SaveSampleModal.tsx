import React, { useState } from 'react';
import { usePen } from '../context/PenContext';
import { BookmarkPlus, X, Check } from 'lucide-react';

interface SaveSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveSampleModal: React.FC<SaveSampleModalProps> = ({ isOpen, onClose }) => {
  const { currentSample, saveCurrentToHistory } = usePen();
  const [sourceName, setSourceName] = useState(currentSample.sourceName);
  const [locationName, setLocationName] = useState(currentSample.locationName);
  const [notes, setNotes] = useState(currentSample.notes || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentToHistory(sourceName, locationName, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-50 rounded-xl text-cyan-700">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Log Water Sample Record
              </h3>
              <p className="text-xs text-slate-500">
                Save active pen telemetry into persistent history
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Quick readings preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="font-semibold text-slate-700 mb-1">Measured Telemetry:</div>
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Lead</span>
                <span className="font-bold text-slate-900">{currentSample.leadPpb} ppb</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Arsenic</span>
                <span className="font-bold text-slate-900">{currentSample.arsenicPpb} ppb</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Mercury</span>
                <span className="font-bold text-slate-900">{currentSample.mercuryPpb} ppb</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sample Source Name
            </label>
            <input
              type="text"
              required
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Kitchen Cold Tap"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location / Facility
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Home - 2nd Floor Sink"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Testing Notes / Conditions (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tested after 2-min cold water flush. Copper pipes with brass valve."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save to Registry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
