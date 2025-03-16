import { useEffect, useState } from "react";
import api from "../../services/api";
import MessageComponent from "../Message";

const DmsWindow = ({ openedUser = {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "state": 0,
    "bot": true,
    "iconFileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "displayName": "string",
    "name": "mpSqnts",
    "twitterId": "nddOQ",
    "lastOnline": "2025-03-16T10:45:34.090Z",
    "updatedAt": "2025-03-16T10:45:34.090Z",
    "tags": [
        {
            "tagId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "Tag": "string",
            "isLocked": true,
            "createdAt": "2025-03-16T10:45:34.090Z",
            "updatedAt": "2025-03-16T10:45:34.090Z"
        }
    ],
    "groups": [
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    ],
    "bio": "string",
    "homeChannel": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "channelId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}, setOpenedUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/channels/${openedUser?.channelId}/messages`).then((response) => {
            setMessages(response.data);
        }).catch((error) => {
            console.error('Error fetching messages:');
            console.error(error);
        }).finally(() => {
            setLoading(false);
        })
    }, [openedUser.channelId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await api.post(`/channels/${openedUser.channelId}/messages`, { content: newMessage });
            setNewMessage('');
            // Fetch messages again to update the list
            const response = await api.get(`/channels/${openedUser.channelId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col flex-1 h-full p-3">
            <div className="flex flex-row justify-between items-center h-fit w-full">
                <span className="text-2xl font-bold">{`@${openedUser?.displayName}`}</span>
            </div>
            <hr className="my-2" />
            <div className="flex-1 flex flex-col-reverse overflow-y-auto">
                {messages.map((message) => (
                    <MessageComponent key={message.id} message={message} />
                ))}
            </div>
            <div className="flex flex-row items-center gap-2 bg-gray-200 rounded-2xl px-3 py-1 shadow-lg">
                <textarea
                    className="flex-1 px-2 py-2 rounded-xl shadow-inner focus:outline-none"
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
                    className="bg-blue-500 text-white p-2 rounded-xl active:scale-50"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default DmsWindow;