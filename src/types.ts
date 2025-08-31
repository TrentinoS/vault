export interface Password {
  id: string;
  _id?: string; // from MongoDB
  product: string;
  userId: string; // The email/login ID for the service
  password: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
}

