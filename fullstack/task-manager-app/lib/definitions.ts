export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: Date;
}

export interface TodoDto {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
