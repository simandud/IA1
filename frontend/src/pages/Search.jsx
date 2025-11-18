import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaUser, FaNewspaper, FaTasks } from 'react-icons/fa';
import { getInitials } from '../utils/helpers';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');

  // Mock search results
  const results = {
    users: [
      { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'Engineering' },
      { id: 2, name: 'Jane Smith', position: 'Product Manager', department: 'Product' },
    ],
    posts: [
      { id: 1, author: { name: 'John Doe' }, content: 'Check out this new feature...', createdAt: new Date() },
    ],
    tasks: [
      { id: 1, title: 'Update documentation', status: 'in-progress', priority: 'high' },
    ],
  };

  const tabs = [
    { key: 'all', label: 'All Results', count: results.users.length + results.posts.length + results.tasks.length },
    { key: 'users', label: 'People', count: results.users.length },
    { key: 'posts', label: 'Posts', count: results.posts.length },
    { key: 'tasks', label: 'Tasks', count: results.tasks.length },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-600 mt-1">Showing results for "{query}"</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 px-4 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Users */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2" />
                People
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((user) => (
                  <div key={user.id} className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.position}</p>
                      <p className="text-xs text-gray-500">{user.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaNewspaper className="mr-2" />
                Posts
              </h2>
              <div className="space-y-4">
                {results.posts.map((post) => (
                  <div key={post.id} className="card p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                        {getInitials(post.author.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      </div>
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {(activeTab === 'all' || activeTab === 'tasks') && results.tasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaTasks className="mr-2" />
                Tasks
              </h2>
              <div className="space-y-4">
                {results.tasks.map((task) => (
                  <div key={task.id} className="card p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                    </div>
                    <span className="badge bg-blue-100 text-blue-800">{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
