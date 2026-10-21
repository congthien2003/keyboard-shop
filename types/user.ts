export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  role: string; // "admin" or "user"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
