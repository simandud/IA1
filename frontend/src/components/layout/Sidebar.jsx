import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaNewspaper,
  FaEnvelope,
  FaTasks,
  FaUsers,
  FaChartBar,
  FaCog,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaHome },
    { name: 'News Feed', path: '/feed', icon: FaNewspaper },
    { name: 'Messages', path: '/messages', icon: FaEnvelope },
    { name: 'Tasks', path: '/tasks', icon: FaTasks },
    { name: 'People', path: '/people', icon: FaUsers },
  ];

  const adminItems = [
    { name: 'Analytics', path: '/admin/analytics', icon: FaChartBar },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-sm transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <nav className="p-4 space-y-2">
        {/* Main menu items */}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}

        {/* Admin menu items */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Administration
              </p>
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
