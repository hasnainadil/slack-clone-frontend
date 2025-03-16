import React, { useEffect, useState } from 'react';
import { format} from 'date-fns'
import api from '../services/api';

const MessageComponent = ({ message }) => {
    const [userIcon, setUserIcon] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const [showLikeOptions, setShowLikeOptions] = useState(false);

    useEffect(() => {
        const ftechIcon = async () => {
            api.get(`/users/${message?.userId}/icon`, { responseType: 'blob' }).then((response) => {
                // setUserIcon(response.data);
                // returned data is a image file convert it to base64 and set it to state
                // console.log("response from icon")
                // console.log(response.data)
                setUserIcon(response.data);
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                reader.onload = () => {
                    setUserIcon(reader.result);
                };
            })
        }
        const fetchUserInfo = async () => {
            api.get(`/users/${message?.userId}`).then((response) => {
                setUserInfo(response.data)
            })
        }
        ftechIcon();
        fetchUserInfo();
    }, [message])

    return (
        <div className='flex flex-row justify-between items-center hover:bg-gray-100 p-2 rounded-lg w-full relative'
            onMouseEnter={() => setShowLikeOptions(true)}
            onMouseLeave={() => {
                setTimeout(() => {
                    setShowLikeOptions(false)
                }, 400);
            }}
        >
            <div className='flex flex-row items-start gap-2'>
                <img src={userIcon}
                    alt='user-icon'
                    className='w-8 h-8 rounded-2xl translate-y-2'
                />
                <div className='flex flex-col pl-1'>
                    <div className='flex flex-row items-center gap-1'>
                        <span className='font-semibold'>{userInfo.displayName}</span>
                        <span className='text-gray-800 text-sm'>
                            {`@${userInfo.name}`}
                        </span>
                        <span className='text-gray-800 text-xs ml-2'>
                            {format(new Date(message?.createdAt), "HH:mm ' on 'dd/MM/yyyy")}
                        </span>
                    </div>
                    <span className='text-left'>{message?.content}</span>
                </div>
            </div>
        </div>
    )
}

export default MessageComponent;