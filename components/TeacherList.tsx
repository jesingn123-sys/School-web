
import React, { useState } from 'react';
import { Teacher } from '../types';
import { Plus, Trash2, QrCode, GraduationCap, Phone, Mail, BookOpen } from 'lucide-react';

interface TeacherListProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onViewICard: (teacher: Teacher) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({ teachers, onAddTeacher, onDeleteTeacher, onViewICard }) => {
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');

  const handleAdd = () => {
    if (!name || !subject) return;
    
    const newTeacher: Teacher = {
      id: crypto.randomUUID(),
      name,
      subject,
      contact,
      email,
      qualification,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`, // Orange for teachers
      createdAt: Date.now(),
    };
    
    onAddTeacher(newTeacher);
    
    // Reset
    setName('');
    setSubject('');
    setContact('');
    setEmail('');
    setQualification('');
    setIsAdding(false);
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold font-sans text-slate-900 mb-1">Faculty</h2>
          <p className="text-slate-500 font-mono text-sm">Total Teachers: {teachers.length}</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-orange-500 text-white p-3 rounded-xl shadow-lg hover:translate-y-1 hover:shadow-md transition-all"
        >
          {isAdding ? <Trash2 size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-md animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-orange-500" />
            Add Faculty Member
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
             <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="input-field" />
             <input type="text" placeholder="Subject / Department" value={subject} onChange={e => setSubject(e.target.value)} className="input-field" />
             <div className="grid grid-cols-2 gap-3">
               <input type="text" placeholder="Contact No" value={contact} onChange={e => setContact(e.target.value)} className="input-field" />
               <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
             </div>
             <input type="text" placeholder="Qualification (e.g. M.Sc, B.Ed)" value={qualification} onChange={e => setQualification(e.target.value)} className="input-field" />
             
             <button 
                onClick={handleAdd}
                className="bg-slate-900 text-white font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-slate-800 text-sm mt-2"
              >
                Save & Generate ID
              </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {teachers.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-mono border border-dashed border-slate-300 rounded-lg bg-white">
            No teachers registered.
          </div>
        ) : (
          teachers.map(teacher => (
            <div key={teacher.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-orange-500 hover:shadow-md transition-all">
              <img src={teacher.avatarUrl} alt={teacher.name} className="w-12 h-12 rounded-full border border-slate-100 object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">{teacher.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{teacher.subject}</span>
                  {teacher.qualification && <span>• {teacher.qualification}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => onViewICard(teacher)}
                  className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  title="View ID Card"
                >
                  <QrCode size={20} />
                </button>
                <button 
                  onClick={() => onDeleteTeacher(teacher.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: #0f172a;
          outline: none;
        }
        .input-field:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 1px #f97316;
        }
      `}</style>
    </div>
  );
};
