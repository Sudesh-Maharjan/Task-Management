import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { User } from "@/types";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/users/profile`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true },);
        console.log(response.data)
        setUser(response.data);
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Navigation />
      <div className="profile-container">
        {user && (
          <div className="user-details">
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* Add other user details if needed */}
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
