export const STOP_CATEGORIES = [
  { label: 'Gas Station', value: 'gas', icon: 'pi pi-car' },
  { label: 'Food/Restaurant', value: 'food', icon: 'pi pi-utensils' },
  { label: 'Rest Break', value: 'rest', icon: 'pi pi-home' },
  { label: 'Maintenance', value: 'maintenance', icon: 'pi pi-wrench' },
  { label: 'Other', value: 'other', icon: 'pi pi-ellipsis-h' },
] as const;

export const STOP_CATEGORY_VALUES = STOP_CATEGORIES.map(cat => cat.value);

export const STOP_CATEGORY_ICONS = {
  gas: 'pi pi-car',
  food: 'pi pi-utensils',
  rest: 'pi pi-home',
  maintenance: 'pi pi-wrench',
  other: 'pi pi-ellipsis-h',
} as const;

export const STOP_CATEGORY_LABELS = {
  gas: 'Gas Station',
  food: 'Food/Restaurant',
  rest: 'Rest Break',
  maintenance: 'Maintenance',
  other: 'Other',
} as const;
