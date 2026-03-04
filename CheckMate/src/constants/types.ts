export type Todo = {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High'
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  targetDate?: string |  null;
  notificationId?: string;
  category: CategoryType;
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

export type CategoryType = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Urgent' | 'Finance';

export const CATEGORIES = [
  { id: 'Work', label: 'Genel İş', icon: 'briefcase-variant', color: '#3B82F6', desc: 'Genel iş süreçleri' },
  { id: 'Crm', label: 'CRM', icon: 'account-tie', color: '#8B5CF6', desc: 'Müşteri ilişkileri yönetimi' },
  { id: 'Mobile', label: 'Mobil', icon: 'cellphone', color: '#10B981', desc: 'Mobil uygulama geliştirme' },
  { id: 'Cloud', label: 'Bulut', icon: 'cloud-sync', color: '#06B6D4', desc: 'Sunucu ve cloud işlemleri' },
  { id: 'Personal', label: 'Kişisel', icon: 'heart-outline', color: '#EC4899', desc: 'Özel işler' },
  { id: 'Urgent', label: 'Acil', icon: 'fire', color: '#EF4444', desc: 'Kritik ve acil işler' },
];
