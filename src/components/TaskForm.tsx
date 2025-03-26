import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TaskFormProps {
  onTaskAdded: () => void;
}

export function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            title: title.trim(),
            description: description.trim() || null,
            completed: false,
          },
        ]);

      if (error) throw error;

      toast.success('Task added successfully');
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (error) {
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter task title"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter task description"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}