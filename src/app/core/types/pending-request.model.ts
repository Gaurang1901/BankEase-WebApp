export interface PendingRequest {
  id: string;
  fullName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string; // ISO date string
  type: 'Instructor' | 'Student' | 'Admin';
  status: 'Pending' | 'Approved' | 'Rejected';
}


