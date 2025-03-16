import React from 'react';
import DmsSideBar from './DmsSideBar';
import DmsWindow from './DmsWindow';

const Dms = () => {
  const [openedUser, setOpenedUser] = React.useState(null);
  return (
    <div className='flex flex-row w-full h-full'>
      <div className='w-80 bg-gray-200 text-black p-2 px-0 pt-5 h-full flex flex-col border-l border-gray-300'>
        <DmsSideBar openedUser={openedUser} setOpenedUser={setOpenedUser} />
      </div>
      <div className='flex flex-col flex-1 h-full p-3'>
        {openedUser &&
          <DmsWindow openedUser={openedUser} setOpenedUser={setOpenedUser} />
        }
      </div>
    </div>
  );
};


export default Dms;
