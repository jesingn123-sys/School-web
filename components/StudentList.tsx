import React, { useState, useRef } from 'react';
import { Student, ClassSection } from '../types';
import { Plus, Trash2, Sparkles, QrCode, User, Phone, Home, Droplet, Calendar, Upload, Camera, FileText, Check } from 'lucide-react';
import { generateRandomStudents, extractStudentFromIDCard } from '../services/geminiService';

interface StudentListProps {
  students: Student[];
  classes: ClassSection[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewICard: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, classes, onAddStudent, onDeleteStudent, onViewICard }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'SINGLE_ADD' | 'BULK_ADD'>('LIST');
  const [loadingAI, setLoadingAI] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  
  // Single Add Form State
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sectionOverride, setSectionOverride] = useState(''); // For OCR cases where class might not match ID exactly
  
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string>('');

  // Bulk Add State
  const [bulkText, setBulkText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOcrProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const data = await extractStudentFromIDCard(base64);
        
        if (data) {
          if (data.name) setName(data.name);
          if (data.rollNumber) setRollNumber(data.rollNumber);
          if (data.parentName) setParentName(data.parentName);
          if (data.parentContact) setParentContact(data.parentContact);
          if (data.dob) setDob(data.dob);
          if (data.bloodGroup) setBloodGroup(data.bloodGroup);
          if (data.address) setAddress(data.address);
          
          // Try to match class
          if (data.grade) {
             const matchedClass = classes.find(c => c.grade === data.grade && (data.section ? c.section === data.section : true));
             if (matchedClass) {
               setSelectedClassId(matchedClass.id);
             } else {
               // If strict match fails, just store what OCR found to help user select manually
               setSectionOverride(data.section || '');
             }
          }
        }
        setIsOcrProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualAdd = () => {
    if (!name || !rollNumber || !selectedClassId) return;

    const selectedClass = classes.find(c => c.id === selectedClassId);
    
    // Default placeholder if no image uploaded
    const finalAvatar = avatarBase64 || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=64748b`;

    const newStudent: Student = {
      id: crypto.randomUUID(),
      name,
      rollNumber,
      grade: selectedClass ? `Class ${selectedClass.grade}` : 'Unknown',
      section: selectedClass ? selectedClass.section : sectionOverride,
      parentName,
      parentContact,
      dob,
      bloodGroup,
      address,
      avatarUrl: finalAvatar,
      createdAt: Date.now(),
    };
    
    onAddStudent(newStudent);
    resetForm();
    setViewMode('LIST');
  };

  const handleBulkAdd = () => {
    if (!bulkText) return;

    const lines = bulkText.split('\n');
    let addedCount = 0;

    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 3) {
         // Expected format: Name, RollNo, Grade, Section (Optional)
         const [bName, bRoll, bGrade, bSection] = parts.map(p => p.trim());
         
         // Try find class
         const cls = classes.find(c => c.grade === bGrade && (bSection ? c.section === bSection : true)) || classes.find(c => c.grade === bGrade);
         
         if (bName && bRoll) {
           const newStudent: Student = {
             id: crypto.randomUUID(),
             name: bName,
             rollNumber: bRoll,
             grade: cls ? `Class ${cls.grade}` : `Class ${bGrade}`,
             section: cls ? cls.section : (bSection || 'A'),
             parentName: '',
             parentContact: '',
             dob: '',
             bloodGroup: '',
             address: '',
             avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(bName)}&background=e2e8f0&color=64748b`,
             createdAt: Date.now()
           };
           onAddStudent(newStudent);
           addedCount++;
         }
      }
    });

    if (addedCount > 0) {
      setBulkText('');
      setViewMode('LIST');
    }
  };

  const resetForm = () => {
    setName('');
    setRollNumber('');
    setSelectedClassId('');
    setParentName('');
    setParentContact('');
    setDob('');
    setBloodGroup('');
    setAddress('');
    setAvatarBase64('');
    setSectionOverride('');
  };

  const handleAIAdd = async () => {
    setLoadingAI(true);
    const generated = await generateRandomStudents(1);
    setLoadingAI(false);
    
    if (generated && generated.length > 0) {
      const s = generated[0];
      setName(s.name || '');
      setRollNumber(s.rollNumber || '');
      setSectionOverride(s.grade || '');
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold font-sans text-slate-900 mb-1">Students</h2>
          <p className="text-slate-500 font-mono text-sm">Total Registered: {students.length}</p>
        </div>
        <div className="flex gap-2">
          {viewMode === 'LIST' ? (
             <button 
              onClick={() => setViewMode('SINGLE_ADD')}
              className="bg-brand-blue text-white p-3 rounded-xl shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Plus size={24} />
            </button>
          ) : (
             <button 
              onClick={() => { setViewMode('LIST'); resetForm(); }}
              className="bg-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {viewMode === 'SINGLE_ADD' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-md animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">New Admission</h3>
            <div className="flex gap-2">
              <input type="file" accept="image/*" ref={ocrInputRef} onChange={handleOcrUpload} className="hidden" />
              <button 
                onClick={() => ocrInputRef.current?.click()}
                disabled={isOcrProcessing}
                className="text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center gap-2 px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity shadow-sm"
              >
                 {isOcrProcessing ? 'Analyzing...' : <><Camera size={14} /> Auto-Fill from ID Card</>}
              </button>
              
              <button onClick={() => setViewMode('BULK_ADD')} className="text-xs font-bold text-slate-500 bg-slate-100 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-200">
                <FileText size={14} /> Bulk Add
              </button>
            </div>
          </div>

          <div className="space-y-4">
             {/* Photo Upload */}
             <div className="flex justify-center mb-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-blue-50 transition-colors overflow-hidden"
                >
                  {avatarBase64 ? (
                    <img src={avatarBase64} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={20} className="text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Upload Photo</span>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
             </div>

            {/* Academic Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Info</p>
                 <button onClick={handleAIAdd} disabled={loadingAI} className="text-[10px] text-brand-blue font-bold flex items-center gap-1">
                   <Sparkles size={10} /> Generate Fake Data
                 </button>
              </div>
              <input type="text" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} className="input-field" />
              <div className="flex gap-3">
                <input type="text" placeholder="Roll No. *" value={rollNumber} onChange={e => setRollNumber(e.target.value)} className="input-field w-1/2" />
                <select 
                  value={selectedClassId} 
                  onChange={e => setSelectedClassId(e.target.value)} 
                  className="input-field w-1/2"
                >
                  <option value="">Select Class *</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.grade} - {c.section}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Details</p>
              
              <div className="flex gap-3 items-center">
                <User size={16} className="text-slate-400" />
                <input type="text" placeholder="Parent/Guardian Name" value={parentName} onChange={e => setParentName(e.target.value)} className="input-field flex-1" />
              </div>

              <div className="flex gap-3 items-center">
                <Phone size={16} className="text-slate-400" />
                <input type="text" placeholder="Contact Number" value={parentContact} onChange={e => setParentContact(e.target.value)} className="input-field flex-1" />
              </div>

              <div className="flex gap-3">
                 <div className="flex-1 flex gap-2 items-center">
                    <Calendar size={16} className="text-slate-400" />
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="input-field w-full text-xs" />
                 </div>
                 <div className="w-1/3 flex gap-2 items-center">
                    <Droplet size={16} className="text-slate-400" />
                    <input type="text" placeholder="Blood Gp" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="input-field w-full" />
                 </div>
              </div>

              <div className="flex gap-3 items-start">
                <Home size={16} className="text-slate-400 mt-2" />
                <textarea placeholder="Residential Address" value={address} onChange={e => setAddress(e.target.value)} className="input-field flex-1 h-20 resize-none" />
              </div>
            </div>

            <button 
              onClick={handleManualAdd}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-slate-800 text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <Check size={18} /> Confirm Admission & Print ID
            </button>
          </div>
        </div>
      )}

      {viewMode === 'BULK_ADD' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-md animate-in fade-in slide-in-from-top-4">
           <h3 className="text-lg font-bold text-slate-800 mb-2">Bulk Import Students</h3>
           <p className="text-xs text-slate-500 mb-4">Paste data in format: <span className="font-mono bg-slate-100 px-1">Name, RollNo, Grade, Section</span> (one per line)</p>
           
           <textarea 
             className="w-full h-48 bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm focus:border-brand-blue outline-none"
             placeholder={`John Doe, 101, 10, A\nJane Smith, 102, 11, Science`}
             value={bulkText}
             onChange={e => setBulkText(e.target.value)}
           />
           
           <div className="flex gap-3 mt-4">
             <button onClick={() => setViewMode('LIST')} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
             <button onClick={handleBulkAdd} className="flex-1 bg-brand-blue text-white font-bold py-3 rounded-lg shadow-lg">Import Students</button>
           </div>
        </div>
      )}

      <div className="space-y-3">
        {students.length === 0 && viewMode === 'LIST' ? (
          <div className="text-center py-12 text-slate-400 font-mono border border-dashed border-slate-300 rounded-lg bg-white">
            No students enrolled yet.
          </div>
        ) : (
          viewMode === 'LIST' && students.map(student => (
            <div key={student.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-brand-blue hover:shadow-md transition-all">
              <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full border border-slate-100 object-cover bg-slate-100" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">{student.name}</h3>
                <p className="text-slate-500 text-xs font-mono uppercase">
                   {student.rollNumber} • {student.grade} {student.section ? `(${student.section})` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => onViewICard(student)}
                  className="p-2 text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  title="View iCard"
                >
                  <QrCode size={20} />
                </button>
                <button 
                  onClick={() => onDeleteStudent(student.id)}
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
          background-color: transparent;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.5rem 0;
          color: #0f172a;
          outline: none;
          font-size: 0.9rem;
        }
        .input-field:focus {
          border-color: #3b82f6;
        }
        .input-field::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};