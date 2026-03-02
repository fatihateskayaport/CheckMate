export type Todo = {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High'
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  notificationId?: string;
};
export type ReminderOption = {
  label: string;
  value: number;
};

export const REMINDER_OPTIONS: ReminderOption[] = [
  { label: 'Tam Vaktinde', value: 0 },
  { label: '10 Dakika Önce', value: 10 },
  { label: '1 Saat Önce', value: 60 },
  { label: '1 Gün Önce', value: 1440 },
];
