'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Stop } from '@/types';
import { useDrive } from '@/hooks';

interface StopFormProps {
  visible: boolean;
  onHide: () => void;
}

const stopCategories = [
  { label: 'Gas Station', value: 'gas', icon: 'pi pi-car' },
  { label: 'Food/Restaurant', value: 'food', icon: 'pi pi-utensils' },
  { label: 'Rest Break', value: 'rest', icon: 'pi pi-home' },
  { label: 'Maintenance', value: 'maintenance', icon: 'pi pi-wrench' },
  { label: 'Other', value: 'other', icon: 'pi pi-ellipsis-h' },
];

export function StopForm({ visible, onHide }: StopFormProps) {
  const { addStop } = useDrive();
  const [category, setCategory] = useState<Stop['category']>('gas');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category) return;

    setLoading(true);
    try {
      await addStop(category, notes || undefined);
      handleReset();
      onHide();
    } catch (error) {
      console.error('Error adding stop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCategory('gas');
    setNotes('');
  };

  return (
    <Dialog
      header="Add Stop"
      visible={visible}
      onHide={onHide}
      className="w-full max-w-md"
      modal
      closable
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Stop Type
          </label>
          <Dropdown
            value={category}
            onChange={e => setCategory(e.value)}
            options={stopCategories}
            optionLabel="label"
            optionValue="value"
            placeholder="Select stop type"
            className="w-full"
            itemTemplate={option => (
              <div className="flex items-center space-x-2">
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </div>
            )}
            valueTemplate={option => (
              <div className="flex items-center space-x-2">
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            placeholder="Add any notes about this stop..."
            rows={3}
            className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text"
            onClick={onHide}
            disabled={loading}
          />
          <Button
            label="Add Stop"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!category}
          />
        </div>
      </div>
    </Dialog>
  );
}
