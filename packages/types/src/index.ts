export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Recording {
  _id: string;
  userId: string;
  title: string;
  duration: number;
  transcript?: string;
  summary?: string;
  keyPoints?: string[];
  status: "processing" | "done" | "failed";
  createdAt: Date;
}
