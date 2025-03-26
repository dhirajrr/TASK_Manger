import React, { useState } from 'react';
import { Check, Trash2, X, Edit2, Save } from 'lucide-react';
import { Task } from '../types/task';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TaskListProps {
  tasks: Task[];
  onTasksUpdated: () => void;
}

export function TaskList({ tasks, onTasksUpdated }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const toggleTaskStatus = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;

      toast.success(`Task marked as ${!task.completed ? 'completed' : 'incomplete'}`);
      onTasksUpdated();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
  };

  const updateTask = async (taskId: string) => {
    if (!editTitle.trim()) {
      toast.error('Task title cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: editTitle.trim(),
          description: editDescription.trim() || null,
        })
        .eq('id', taskId);

      if (error) throw error;

      toast.success('Task updated successfully');
      setEditingTask(null);
      onTasksUpdated();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Task deleted successfully');
      onTasksUpdated();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks yet. Start by adding a new task!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white p-4 rounded-lg shadow-md ${
            task.completed ? 'bg-gray-50' : ''
          }`}
        >
          {editingTask === task.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task description (optional)"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => updateTask(task.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className={`p-2 rounded-full ${
                    task.completed
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {task.completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => startEditing(task)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}