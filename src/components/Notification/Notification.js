import { useEffect, useState } from "react";
import api from "../../services/api";

const Notification = () => {
    const [unreadactivity, setUnreadactivity] = useState([]);
    useEffect(() => {
        console.log("Fetching unread activity...");
        api.get(`/activity/timeline`, {
            params: {
                per_channel: true,
                all: true,
            }
        }).then((response) => {
            console.log("Unread activity:");
            console.log(response.data);
            setUnreadactivity(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }, [])

    return (
        <div className="w-64 bg-gray-200 border-l border-gray-500 flex flex-col gap-2 h-full">
            <h2 className="text-xl font-semibold p-4">Activity</h2>
            <div className="flex flex-col p-4 gap-2 flex-grow overflow-y-auto">
                {unreadactivity.map((notification, index) => (
                    <ActivityItem notification={notification} key={index} />
                ))}
            </div>
        </div>
    )
}

const ActivityItem = ({ notification }) => {
    const [channelInfo, setChannelInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        api.get(`/channels/${notification.channelId}`).then((response) => {
            setChannelInfo(response.data);
        }).catch((error) => {
            console.error(error);
        });

        api.get(`/users/${notification.userId}`).then((response) => {
            setUserInfo(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        // get the user icon 
        api.get(`/files/${userInfo?.iconFileId}`, { responseType: 'blob' }).then((response) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(response.data);
            fileReader.onload = () => {
                setIcon(fileReader.result);
            };
        }).catch((error) => {
            console.error('Error fetching user icon:');
            console.error(error);
        }).finally(() => {
        });
    }, [userInfo])
    if(!channelInfo || !userInfo) return null;

    return (
        <div className="flex flex-col gap-1 p-2 border-b border-gray-500 bg-gray-50 rounded-lg overflow-x-clip">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{channelInfo?.name}</h3>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row items-center gap-2">
                    <img src={icon} alt={userInfo?.name} className="w-8 h-8 rounded-full" />
                    <div className="flex flex-col flex-1">
                        <div className="flex flex-row items-center gap-2 justify-start">
                            <h4 className="font-semibold">{userInfo?.displayName}</h4>
                            <span className="text-xs text-gray-500">{new Date(notification.updatedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 w-full text-left">{notification.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification;