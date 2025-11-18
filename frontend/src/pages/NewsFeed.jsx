import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { FaImage, FaSmile, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { formatRelativeTime, getInitials } from '../utils/helpers';

const NewsFeed = () => {
  const [postContent, setPostContent] = useState('');

  // Mock posts data
  const posts = [
    {
      id: 1,
      author: { name: 'John Doe', avatar: null, position: 'Software Engineer' },
      content: 'Just completed the new feature! Check it out team!',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: [{ user: '1' }, { user: '2' }],
      commentsCount: 3,
    },
    {
      id: 2,
      author: { name: 'Jane Smith', avatar: null, position: 'Product Manager' },
      content: 'Great team meeting today! Excited about our Q1 goals.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: [{ user: '1' }],
      commentsCount: 1,
    },
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    console.log('Creating post:', postContent);
    setPostContent('');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">News Feed</h1>

        {/* Create Post Card */}
        <div className="card p-6">
          <form onSubmit={handleCreatePost}>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full border-none focus:ring-0 resize-none"
              rows="3"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <button type="button" className="flex items-center text-gray-600 hover:text-primary-600">
                  <FaImage className="mr-2" />
                  Photo
                </button>
                <button type="button" className="flex items-center text-gray-600 hover:text-primary-600">
                  <FaSmile className="mr-2" />
                  Feeling
                </button>
              </div>
              <button
                type="submit"
                disabled={!postContent.trim()}
                className="btn btn-primary"
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="card p-6">
            {/* Post Header */}
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                {getInitials(post.author.name)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                <p className="text-sm text-gray-500">{post.author.position}</p>
                <p className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-900 mb-4">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
                <FaHeart />
                <span className="text-sm">{post.likes.length} Likes</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                <FaComment />
                <span className="text-sm">{post.commentsCount} Comments</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500">
                <FaShare />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default NewsFeed;
