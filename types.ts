
// Declare global jsQR function
declare global {
  interface Window {
    jsQR: (data: Uint8ClampedArray, width: number, height: number, options?: any) => { data: string; location: any } | null;
  }
}

export interface SchoolDetails {
  name: string;
  address: string;
  logoUrl?: string; // Optional URL or base64
  establishedYear?: string;
  startSchoolTime?: string; // Format "HH:mm" e.g. "08:30"
}

export interface ClassSection {
  id: string;
  grade: string; // e.g. "10", "12"
  section: string; // e.g. "A", "Science"
  classTeacherId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  contact: string;
  email: string;
  qualification: string;
  avatarUrl: string;
  createdAt: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string; // This will now likely match a ClassSection
  section: string;
  
  // Expanded Details
  parentName: string;
  parentContact: string;
  dob: string;
  bloodGroup: string;
  address: string;

  avatarUrl: string;
  createdAt: number;
}

export interface AttendanceRecord {
  id: string;
  personId: string; // Can be student or teacher
  type: 'STUDENT' | 'TEACHER';
  status: 'PRESENT' | 'LATE';
  timestamp: number;
  date: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  STUDENTS = 'STUDENTS',
  TEACHERS = 'TEACHERS',
  CLASSES = 'CLASSES',
  SCHOOL_SETUP = 'SCHOOL_SETUP'
}
