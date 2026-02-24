export type Todo = {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High'
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
};
