'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FormDropdown } from '@/components/inputs/FormDropdown';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { useDrive } from '@/providers/app-context';
import { Stop } from '@/types';

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
        <FormDropdown
          label="Stop Type"
          name="category"
          options={stopCategories}
          value={category}
          onChange={value => setCategory(value as Stop['category'])}
          placeholder="Select stop type"
          required
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

        <FormTextarea
          label="Notes (Optional)"
          name="notes"
          value={notes}
          onChange={setNotes}
          placeholder="Add any notes about this stop..."
        />

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
