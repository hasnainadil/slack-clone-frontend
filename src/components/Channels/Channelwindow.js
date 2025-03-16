import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { EllipsisIcon } from 'lucide-react';
import { MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, InputLabel, FormControl, Popover } from '@mui/material';
import MessageComponent from '../Message';

const ChannelWindow = ({ channel }) => {
    const [allChannels, setChannels] = useState([]);
    const [messages, setMessages] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [channelName, setChannelName] = useState('');
    const [parentChannel, setParentChannel] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const getChannelPath = (channelId) => {
        if (!channelId) return '';
        const channel = allChannels.find(ch => ch.id === channelId);
        if (!channel) return '';
        if (!channel.parentId) return channel.name;
        return `${getChannelPath(channel.parentId)}/${channel.name}`;
    };

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await api.get(`/channels?include-dm=false`);
                setChannels(response.data?.public);
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        };
        fetchChannels();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!channel?.id) return;
            try {
                const response = await api.get(`/channels/${channel.id}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [channel]);

    const channelPath = getChannelPath(channel?.id);
    if (!channel) return null;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateChildChannel = () => {
        setDialogOpen(true);
        setParentChannel(channel.id);
        handleMenuClose();
    };

    const handleCreate = () => {
        // Handle the creation of the new channel
        console.log('New channel created:', { name: channelName, parent: parentChannel });
        setChannelName('');
        setParentChannel('');
        setDialogOpen(false);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await api.post(`/channels/${channel.id}/messages`, { content: newMessage });
            setNewMessage('');
            // Fetch messages again to update the list
            const response = await api.get(`/channels/${channel.id}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col flex-1 h-full">
            {/* header */}
            <div className="flex flex-row items-center justify-between gap-2 h-12">
                <div className="">
                    <h2 className="text-3xl font-bold">{channelPath}</h2>
                </div>
                <div className='flex flex-row gap-2'>
                    <IconButton onClick={handleMenuOpen}>
                        <EllipsisIcon size={24} />
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleCreateChildChannel}>Create a child channel</MenuItem>
                        {/* Placeholder for other options */}
                    </Popover>
                </div>
            </div>
            <hr className="my-2 border" />
            {/* channel content */}
            <div className="flex flex-col-reverse flex-1 overflow-y-auto p-2 w-full items-start gap-4">
                {messages.map((message) => (
                    <MessageComponent key={message.id} message={message} />
                ))}
            </div>
            {/* channel footer with input */}
            <div className="flex flex-row items-center gap-2 h-20 p-2 border-t">
                <textarea
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Type a message..."
                    value={newMessage}
                    rows={1}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create a Channel</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Parent Channel</InputLabel>
                        <Select
                            value={parentChannel}
                            onChange={(e) => setParentChannel(e.target.value)}
                            label="Parent Channel"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {allChannels.map((channel) => (
                                <MenuItem key={channel.id} value={channel.id}>
                                    {channel.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Channel Name"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        inputProps={{ maxLength: 20 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};



export default ChannelWindow;

// [
//     {
//         "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "channelId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "content": "string",
//         "createdAt": "2025-03-16T08:11:45.996Z",
//         "updatedAt": "2025-03-16T08:11:45.996Z",
//         "pinned": true,
//         "stamps": [
//             {
//                 "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//                 "stampId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//                 "count": 0,
//                 "createdAt": "2025-03-16T08:11:45.996Z",
//                 "updatedAt": "2025-03-16T08:11:45.996Z"
//             }
//         ],
//         "threadId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//     }
// ]