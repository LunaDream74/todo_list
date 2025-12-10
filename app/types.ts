export interface Todo {
  id: string;
  text: string;
  deadline: string; // ISO date string
  status: 'pending' | 'done';
  finishedTime?: string; // ISO timestamp string
}
