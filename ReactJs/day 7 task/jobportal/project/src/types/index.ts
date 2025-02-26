export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote';
  category: string;
  company: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}