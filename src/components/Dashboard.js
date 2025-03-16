import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BellIcon, LogOutIcon, MessageSquareText, RssIcon } from 'lucide-react';
import api from '../services/api';

const SidebarLinks = [
  {
    name: 'channels',
    icon: <RssIcon size={24} />,
    to: 'channels',
    label: 'Channels',
  },
  {
    name: 'dms',
    icon: <MessageSquareText size={24} />,
    to: 'dms',
    label: 'Direct Messages',
  },
  {
    name: 'activity',
    icon: <BellIcon size={24} />,
    to: 'activity',
    label: 'activity',
  },
]

const Dashboard = () => {
  const [selected, setSelected] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (name) => {
    setSelected(name); // Set the selected page for highlighting
  };
  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    const currentLink = SidebarLinks.find(link => link.to === currentPath);
    if (currentLink) {
      setSelected(currentLink.name);
    }
  }, [location]);

  return (
    <div className="flex w-screen h-dvh duration-300 ease-linear">
      {/* Sidebar */}
      <div className="w-16 bg-gray-200 text-black p-2 pt-5 h-full flex flex-col justify-between items-center">
        {/* Links to different services */}
        <div className='flex flex-col w-full flex-grow items-center gap-4 pt-36 duration-300 ease-linear'>
          {SidebarLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => handleLinkClick(link.name)}
              className={`w-fit p-2 rounded-2xl mb-2 hover:bg-gray-300 hover:text-gray-800 ${selected === link.name ? 'bg-gray-800 text-gray-50' : ''}`}
              title={link.label}
            >
              {link.icon}
            </Link>
          ))}
        </div>

        {/* Profile setup */}
        <div className='w-full h-24 flex flex-col justify-end items-center pb-10'>
          <button className='hover:bg-red-100 rounded-full p-3 active:scale-50' onClick={() => {
            api.post(`/logout`).then((response) => {
              console.log("Logged out");
              console.log(response);
              window.location.href = "/login";
            }).catch((error) => {
              console.error(error);
            })
          }} >
            <LogOutIcon size={24} />
          </button>

        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1">
        {/* Render the child component here */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
