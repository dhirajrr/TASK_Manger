export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  user_id: string;
}