import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MessageSquareText, RssIcon } from 'lucide-react';


const Dashboard = () => {
  const [selected, setSelected] = useState('channels');

  const handleLinkClick = (name) => {
    setSelected(name); // Set the selected page for highlighting
  };

  return (
    <div className="flex w-screen h-dvh">
      {/* Sidebar */}
      <div className="w-52 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        
      </div>

      {/* Main content area */}
      <div className="flex-1 p-5">
        {/* Render the child component here */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
