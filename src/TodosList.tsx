import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';

export interface Todo {
  id: string | number; // Depends on if your DB uses UUID or BigInt Auto-increment
  title: string;
  is_completed: boolean;
  created_at?: string;
}

export default function TodosList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Fetch Todos on Mount
  
  const fetchTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
      .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

        if (error) throw error;
      setTodos((data as Todo[]) || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching todos:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 2. Add a New Todo
  const addTodo = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodo.trim()}])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log(data);
        
        setTodos([data[0] as Todo, ...todos]);
        setNewTodo('');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding todo:', error.message);
      }
    }
  };

  // 3. Toggle Todo Completion Status
  const toggleComplete = async (id: string | number, currentStatus: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: !currentStatus })
        .eq('id', id);
        
        if (error) throw error;

        // Update local state
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
        ).sort((a,b) => {return +a.is_completed - +b.is_completed})
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating todo:', error.message);
      }
    }
  };

  // 4. Delete a Todo
  const deleteTodo = async (id: string | number): Promise<void> => {
    try {
      const { error } = await supabase
      .from('todos')
        .delete()
        .eq('id', id);

        if (error) throw error;
        
        // Filter out deleted item from local state
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting todo:', error.message);
        }
      }
    };
    
    useEffect(() => {
      (()=>{
  
        fetchTodos();
      })()
    }, []);
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {todos.filter(t => !t.is_completed).length} remaining
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 min-w-0 block w-full px-4 py-2 text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Add
          </button>
        </form>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-4 text-sm text-gray-500">Loading tasks...</div>
        ) : (
          /* Todo List */
          <ul className="divide-y divide-gray-200">
            {todos.length === 0 ? (
              <p className="text-center py-6 text-sm text-gray-400">No tasks yet. Enjoy your day!</p>
            ) : (
              todos.sort((a, b) => +a.is_completed - +b.is_completed).map((todo) => (
                <li key={todo.id} className="flex items-center justify-between py-3 group">
                  <div className="flex items-center min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.is_completed}
                      onChange={() => toggleComplete(todo.id, todo.is_completed)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span
                      className={`ml-3 truncate text-sm font-medium transition-all ${
                        todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded"
                    aria-label="Delete todo"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}