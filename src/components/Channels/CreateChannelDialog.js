import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import api from '../../services/api';

const CreateChannelDialog = ({ open, onClose, onCreate }) => {
    const [channelName, setChannelName] = useState('');
    const [parentChannel, setParentChannel] = useState('');
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await api.get('/channels?include-dm=false');
                setChannels(response.data?.public || []);
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        };

        fetchChannels();
    }, []);

    const handleCreate = () => {
        onCreate({ name: channelName, parent: parentChannel === '' ? null : parentChannel });
        setChannelName('');
        setParentChannel('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a Channel</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="parent-channel-label">Parent Channel</InputLabel>
                    <Select
                        labelId="parent-channel-label"
                        value={parentChannel}
                        onChange={(e) => setParentChannel(e.target.value)}
                        label="Parent Channel"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {channels.map((channel) => (
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
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate} color="primary" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateChannelDialog;