import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ClipboardList, LogIn, LogOut } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { supabase } from './lib/supabase';
import type { Task } from './types/task';
import type { User } from '@supabase/supabase-js';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      } else {
        setTasks([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123',
    });

    if (error) {
      // If the user doesn't exist, sign them up
      if (error.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'test@example.com',
          password: 'test123',
        });

        if (signUpError) {
          console.error('Error signing up:', signUpError);
        }
      } else {
        console.error('Error signing in:', error);
      }
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          </div>
          
          <button
            onClick={user ? handleSignOut : handleSignIn}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {user ? (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </button>
        </div>

        {user ? (
          <div className="space-y-8">
            <TaskForm onTaskAdded={fetchTasks} />
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tasks...</p>
              </div>
            ) : (
              <TaskList tasks={tasks} onTasksUpdated={fetchTasks} />
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Please sign in to manage your tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;