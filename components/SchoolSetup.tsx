
import React, { useState } from 'react';
import { SchoolDetails } from '../types';
import { School, Save, MapPin, Calendar, Image as ImageIcon, Clock } from 'lucide-react';

interface SchoolSetupProps {
  currentDetails: SchoolDetails | null;
  onSave: (details: SchoolDetails) => void;
}

export const SchoolSetup: React.FC<SchoolSetupProps> = ({ currentDetails, onSave }) => {
  const [name, setName] = useState(currentDetails?.name || '');
  const [address, setAddress] = useState(currentDetails?.address || '');
  const [est, setEst] = useState(currentDetails?.establishedYear || '');
  const [logo, setLogo] = useState(currentDetails?.logoUrl || '');
  const [startTime, setStartTime] = useState(currentDetails?.startSchoolTime || '08:00');

  const handleSave = () => {
    if (!name) return;
    onSave({
      name,
      address,
      establishedYear: est,
      logoUrl: logo,
      startSchoolTime: startTime
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto w-full pb-24">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue">
          <School size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">School Profile</h1>
        <p className="text-slate-500">Configure your institution's identity</p>
      </div>

      <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">School Name</label>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 rounded-lg focus-within:border-brand-blue transition-colors">
            <School size={20} className="text-slate-400" />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Springfield High School"
              className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Address / Location</label>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 rounded-lg focus-within:border-brand-blue transition-colors">
            <MapPin size={20} className="text-slate-400" />
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Education Lane, NY"
              className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Est. Year</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 rounded-lg focus-within:border-brand-blue transition-colors">
              <Calendar size={20} className="text-slate-400" />
              <input 
                type="text" 
                value={est}
                onChange={(e) => setEst(e.target.value)}
                placeholder="1995"
                className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Start Time</label>
             <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 rounded-lg focus-within:border-brand-blue transition-colors">
              <Clock size={20} className="text-slate-400" />
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-transparent w-full outline-none text-slate-900 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Used for 'Late' marking</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Logo URL (Optional)</label>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 rounded-lg focus-within:border-brand-blue transition-colors">
            <ImageIcon size={20} className="text-slate-400" />
            <input 
              type="text" 
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://..."
              className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!name}
          className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
};
