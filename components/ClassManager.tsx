
import React, { useState } from 'react';
import { ClassSection } from '../types';
import { Plus, Trash2, Layers } from 'lucide-react';

interface ClassManagerProps {
  classes: ClassSection[];
  onAddClass: (cls: ClassSection) => void;
  onDeleteClass: (id: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({ classes, onAddClass, onDeleteClass }) => {
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');

  const handleAdd = () => {
    if (!grade || !section) return;
    onAddClass({
      id: crypto.randomUUID(),
      grade,
      section,
    });
    setGrade('');
    setSection('');
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
          <Layers size={24} />
        </div>
        <div>
           <h2 className="text-3xl font-bold font-sans text-slate-900">Classes & Sections</h2>
           <p className="text-slate-500 text-sm">Manage academic structure</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Add New Class</h3>
        <div className="flex gap-2">
          <input 
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade (e.g. 10)"
            className="flex-1 bg-slate-50 border border-slate-300 p-3 rounded-lg outline-none focus:border-purple-500"
          />
          <input 
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Section (e.g. A)"
            className="flex-1 bg-slate-50 border border-slate-300 p-3 rounded-lg outline-none focus:border-purple-500"
          />
          <button 
            onClick={handleAdd}
            disabled={!grade || !section}
            className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                 {cls.grade}
               </div>
               <div>
                 <p className="font-bold text-slate-900">Grade {cls.grade}</p>
                 <p className="text-xs text-slate-500 font-mono">Section {cls.section}</p>
               </div>
             </div>
             <button 
               onClick={() => onDeleteClass(cls.id)}
               className="text-slate-300 hover:text-red-500 p-2 transition-colors"
             >
               <Trash2 size={18} />
             </button>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full text-center py-8 text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            No classes added yet.
          </div>
        )}
      </div>
    </div>
  );
};
