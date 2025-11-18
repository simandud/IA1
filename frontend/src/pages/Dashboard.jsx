import React from 'react';
import Layout from '../components/layout/Layout';
import { FaUsers, FaTasks, FaNewspaper, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { name: 'Team Members', value: '124', icon: FaUsers, color: 'bg-blue-500', link: '/people' },
    { name: 'Active Tasks', value: '18', icon: FaTasks, color: 'bg-green-500', link: '/tasks' },
    { name: 'Posts This Week', value: '42', icon: FaNewspaper, color: 'bg-purple-500', link: '/feed' },
    { name: 'Completion Rate', value: '87%', icon: FaChartLine, color: 'bg-orange-500', link: '/admin' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your team.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.name} to={stat.link} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/feed" className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                <div className="flex items-center">
                  <FaNewspaper className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium">Create a Post</span>
                </div>
              </Link>
              <Link to="/tasks" className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                <div className="flex items-center">
                  <FaTasks className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Create a Task</span>
                </div>
              </Link>
              <Link to="/messages" className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                <div className="flex items-center">
                  <FaUsers className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Start a Conversation</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New task assigned: "Update documentation"</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">John Doe completed "Design review"</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New post in Engineering</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
