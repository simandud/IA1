import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaEdit } from 'react-icons/fa';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { id } = useParams();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with 5+ years of experience in building scalable web applications.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
    joinedDate: '2020-01-15',
    performanceMetrics: {
      tasksCompleted: 42,
      postsCreated: 18,
      interactionScore: 95,
    },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-semibold">
                {getInitials(user.name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-lg text-gray-600">{user.position}</p>
                <p className="text-sm text-gray-500">{user.department}</p>
              </div>
            </div>
            <button className="btn btn-primary flex items-center">
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <FaEnvelope className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <FaPhone className="h-5 w-5" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <FaMapMarkerAlt className="h-5 w-5" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700">{user.bio}</p>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span key={skill} className="badge bg-primary-100 text-primary-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {user.performanceMetrics.tasksCompleted}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tasks Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {user.performanceMetrics.postsCreated}
              </p>
              <p className="text-sm text-gray-600 mt-1">Posts Created</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {user.performanceMetrics.interactionScore}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Interaction Score</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
