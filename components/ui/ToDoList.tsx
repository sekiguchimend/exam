import React, { useState } from 'react';

const ToDoList = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo('');
    }
  };

  const removeTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ToDoリスト</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="新しいToDoを追加..."
            className="flex-1 py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={addTodo}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-r-md"
          >
            追加
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex justify-between items-center"
            >
              <span className="text-gray-800">{todo}</span>
              <button
                onClick={() => removeTodo(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToDoList;