import React, { useState, useEffect, useCallback } from 'react';
import { SearchIcon, LoaderIcon, HashIcon, PlusCircleIcon } from 'lucide-react';
import api from '../../services/api';

const ChannelsSidebar = ({ openedChannel, setOpenedChannel, dialogOpen, setDialogOpen, reloadChannel, setReloadChannel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChannels = async (query) => {
        setLoading(true);
        try {
            const response = await api.get(`/channels?include-dm=false`, {
            });
            setChannels(response.data?.public);
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const debounceFetchChannels = useCallback(
        debounce((query) => {
            fetchChannels(query);
        }, 500),
        []
    );

    useEffect(() => {
        if (reloadChannel) {
            fetchChannels();
            setReloadChannel(false);
        }
    }, [reloadChannel, setReloadChannel]);

    useEffect(() => {
        debounceFetchChannels(searchTerm.trim());
    }, [searchTerm, debounceFetchChannels]);

    return (
        <div className="flex flex-col h-full pt-1">
            <div className='flex flex-row items-center justify-between gap-2 p-2'>
                <h2 className="font-bold">Channels</h2>
                <button className='p-2 rounded-full text-gray-800 border' onClick={() => {
                    setDialogOpen(true);
                }}>
                    <PlusCircleIcon size={20} />
                </button>
            </div>
            <div className="relative px-5 mb-4">
                <input
                    type="text"
                    className={`w-full px-2 py-1 pr-9 border rounded-lg focus:outline-gray-400 focus:ring-1`}
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute top-2 right-7" size={20} />
            </div>
            {loading ? (
                <div className="flex justify-center items-center flex-grow">
                    <LoaderIcon className="animate-spin" size={24} />
                </div>
            ) : (
                <ul className='flex flex-col gap-2 overflow-y-auto pl-5 flex-grow'>
                    {channels?.map((channel) => {
                        // check if a channen is inside a channel as a child. look for the channels parentId in the channels array
                        if (channels.find((c) => c.id === channel.parentId)) {
                            return null;
                        }
                        return (
                            <SingalChannelEntry
                                key={channel.id}
                                allChannels={channels}
                                channel={channel}
                                openedChannel={openedChannel}
                                setOpenedChannel={setOpenedChannel}
                            />
                        )
                    })}
                </ul>
            )}
        </div>
    );
};

const SingalChannelEntry = ({ allChannels, channel, openedChannel, setOpenedChannel }) => {
    const [openedChild, setOpenedChild] = useState(false);

    return (
        <li key={channel.id} className='flex flex-col gap-2 z-0' onClick={(e) => {
            e?.stopPropagation();
            console.log("channel clicked", channel);
            setOpenedChannel(channel);
        }}>
            <div className={`flex flex-row items-center gap-2 hover:bg-blue-50 rounded-l-full cursor-pointer px-3 py-2 ${openedChannel?.id === channel.id ? 'bg-white' : ''}`}>
                <button
                    disabled={channel?.children?.length === 0}
                    className={`${channel?.children?.length === 0 ? '' : ' border-black border'} p-1 rounded-md z-50`}
                    onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation to the li
                        setOpenedChild(prev => !prev);
                    }}
                >
                    <HashIcon size={16} />
                </button>
                <span className='text-sm font-semibold'>
                    {channel?.name}
                </span>
            </div>
            {openedChild && (
                <ul className='flex flex-col gap-2 ml-5 border-l border-l-gray-500'>
                    {channel?.children?.map((childChannelId) => {
                        const childChannel = allChannels.find((c) => c.id === childChannelId);
                        return (
                            <SingalChannelEntry
                                key={childChannel.id}
                                allChannels={allChannels}
                                channel={childChannel}
                                openedChannel={openedChannel}
                                setOpenedChannel={setOpenedChannel}
                            />
                        );
                    })}
                </ul>
            )}
        </li>
    );
};

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


export default ChannelsSidebar;