
import React from 'react';
import { Student, Teacher, SchoolDetails } from '../types';
import QRCode from 'react-qr-code';
import { ArrowLeft, Download, School } from 'lucide-react';

interface ICardProps {
  person: Student | Teacher;
  type: 'STUDENT' | 'TEACHER';
  schoolDetails: SchoolDetails | null;
  onClose: () => void;
}

export const ICard: React.FC<ICardProps> = ({ person, type, schoolDetails, onClose }) => {
  
  const handleDownload = () => {
    const svg = document.getElementById("person-qr-code");
    if (!svg) return;

    // We need to create a temporary canvas to draw the full card
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // High res for printing
    const width = 800;
    const height = 1000; // Taller for ID card aspect ratio
    canvas.width = width;
    canvas.height = height;

    if (!ctx) return;

    // 1. Draw Card Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    // 2. Header Background
    const headerColor = type === 'STUDENT' ? "#2563eb" : "#f97316";
    ctx.fillStyle = headerColor;
    ctx.fillRect(0, 0, width, 250);
    
    // 3. School Details
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(schoolDetails?.name || "School Name", width / 2, 120);
    
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(schoolDetails?.address || "Address", width / 2, 170);

    // 4. Person Name
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 50px sans-serif";
    ctx.fillText(person.name, width / 2, 350);

    // 5. Role Badge
    ctx.fillStyle = "#f1f5f9";
    const badgeWidth = 300;
    ctx.fillRect((width - badgeWidth)/2, 380, badgeWidth, 60);
    ctx.font = "bold 30px monospace";
    ctx.fillStyle = type === 'STUDENT' ? "#2563eb" : "#f97316";
    ctx.fillText(type, width / 2, 420);

    // 6. Draw QR Code
    // We convert the SVG QR code to an image to draw it on canvas
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    // Add base64 header
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));

    img.onload = () => {
      // Draw QR Code
      const qrSize = 400;
      const qrX = (width - qrSize) / 2;
      const qrY = 500;
      
      // Draw white background for QR Code (Quiet Zone)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
      
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // 7. Footer text
      ctx.fillStyle = "#94a3b8";
      ctx.font = "20px monospace";
      ctx.fillText(`ID: ${person.id}`, width / 2, height - 40);
      
      // Trigger Download
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${person.name.replace(/\s+/g, '_')}_ID_Card.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
  };

  const isStudent = (p: any): p is Student => type === 'STUDENT';
  const themeColor = type === 'STUDENT' ? 'bg-brand-blue' : 'bg-orange-500';

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-sm my-auto">
        <button 
          onClick={onClose}
          className="mb-6 flex items-center gap-2 text-white hover:text-brand-light transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Back to App
        </button>

        {/* Card Container - Visual Representation */}
        <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-200">
           {/* Header Stripe */}
           <div className={`h-32 ${themeColor} relative flex flex-col items-center justify-center text-center p-4`}>
              <div className="absolute top-4 left-4 text-white opacity-80">
                <School size={24} />
              </div>
              <h1 className="text-white font-bold text-xl leading-tight w-4/5 mx-auto">{schoolDetails?.name || "School Name"}</h1>
              <p className="text-white/80 text-xs mt-1 font-mono">{schoolDetails?.address || "Location"}</p>
              
              {/* Decorative */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-4 left-8 w-8 h-8 bg-white opacity-10 rounded-full"></div>
           </div>

           <div className="relative px-6 pb-8 -mt-10 flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden mb-3 shadow-lg z-10">
               <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
             </div>
             
             <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{person.name}</h2>
             <span className={`px-4 py-1 rounded-full text-xs font-bold font-mono mb-6 border uppercase tracking-wider ${type === 'STUDENT' ? 'bg-blue-50 text-brand-blue border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
               {type === 'STUDENT' ? (isStudent(person) ? person.grade : '') : (person as Teacher).subject} {type}
             </span>

             {/* QR Code Container with Padding (Quiet Zone) */}
             <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-inner mb-6 w-full max-w-[220px] mx-auto aspect-square flex items-center justify-center">
               <QRCode 
                 id="person-qr-code"
                 value={person.id} 
                 level="H" // High Error Correction
                 size={256}
                 style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                 fgColor="#000000"
                 bgColor="#ffffff"
               />
             </div>

             {/* Details Table */}
             <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-left border-t border-slate-100 pt-4">
               {isStudent(person) ? (
                 <>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Roll No</span>
                      <span className="font-bold text-slate-700 text-sm">{person.rollNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Section</span>
                      <span className="font-bold text-slate-700 text-sm">{person.section}</span>
                    </div>
                    <div className="col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                       <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Parent/Guardian</span>
                       <span className="font-bold text-slate-700">{person.parentName || 'N/A'}</span>
                       <div className="text-slate-500 font-mono mt-0.5">{person.parentContact}</div>
                    </div>
                 </>
               ) : (
                  <>
                     <div>
                       <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Faculty ID</span>
                       <span className="font-bold text-slate-700 text-sm">FAC-{person.id.substring(0,4).toUpperCase()}</span>
                     </div>
                     <div className="text-right">
                       <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Qual.</span>
                       <span className="font-bold text-slate-700 text-sm">{(person as Teacher).qualification}</span>
                     </div>
                     <div className="col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Contact</span>
                        <span className="font-bold text-slate-700 break-all">{(person as Teacher).email}</span>
                     </div>
                  </>
               )}
             </div>
           </div>
        </div>

        <div className="mt-6 flex justify-center pb-8">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wide"
          >
            <Download size={20} className="text-brand-blue" />
            Save to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
