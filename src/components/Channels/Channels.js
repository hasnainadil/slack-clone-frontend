import React, { useState } from 'react';
import api from '../../services/api';
import CreateChannelDialog from './CreateChannelDialog';
import ChannelsSidebar from './Channelsidebar';
import ChannelWindow from './Channelwindow';

const Channels = () => {
  const [openedChannel, setOpenedChannel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reloadChannel, setReloadChannel] = useState(true);

  const handleCreateChannel = async (newChannel) => {
    try {
      await api.post('/channels', newChannel);
      setReloadChannel(true);
      // Refresh the channels list or handle the new channel as needed
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  return (
    <div className='flex flex-row w-full h-full'>
      <div className='w-64 bg-gray-200 text-black p-2 px-0 pt-5 h-full flex flex-col border-l border-gray-300'>
        <ChannelsSidebar
          setOpenedChannel={setOpenedChannel}
          openedChannel={openedChannel}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reloadChannel={reloadChannel}
          setReloadChannel={setReloadChannel}
        />
      </div>
      <div className='flex flex-col flex-1 h-full p-4'>
        <ChannelWindow channel={openedChannel} />
      </div>
      <CreateChannelDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateChannel}
      />
    </div>
  );
};

export default Channels;
