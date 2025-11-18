import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('OAuth authentication failed');
        navigate('/login');
        return;
      }

      if (token) {
        // Store token
        localStorage.setItem('token', token);

        // Fetch user data
        fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              localStorage.setItem('user', JSON.stringify(data.data));
              updateUser(data.data);
              toast.success('Login successful!');
              navigate('/dashboard');
            } else {
              throw new Error('Failed to fetch user data');
            }
          })
          .catch(err => {
            console.error('OAuth callback error:', err);
            toast.error('Authentication failed');
            navigate('/login');
          });
      } else {
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, updateUser]);

  return <LoadingSpinner />;
};

export default OAuthCallback;
