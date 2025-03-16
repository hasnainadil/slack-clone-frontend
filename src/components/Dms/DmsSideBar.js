import React, { useState, useEffect, useCallback, useRef, use } from 'react';
import { SearchIcon, LoaderIcon, HashIcon, PlusCircleIcon, CircleIcon } from 'lucide-react';
import api from '../../services/api';

const DmsSideBar = ({ openedUser, setOpenedUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async (query) => {
        setLoading(true);
        try {
            const response = await api.get('/users', {
                params: {
                    name: query
                }
            });
            console.log('response:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    const debounceFetchUsers = useCallback(
        debounce((query) => {
            fetchUsers(query);
        }, 500),
        []
    );

    useEffect(() => {
        console.log('fetching users');
        debounceFetchUsers(searchTerm.trim());
    }, [debounceFetchUsers, searchTerm]);

    return (
        <div className='w-full bg-gray-200 text-black p-2 px-0 pt-5 h-full flex flex-col border-l border-gray-300'>
            <div className='flex flex-col items-center justify-between p-2'>
                <h2 className='text-lg font-semibold text-left pl-3'>User List</h2>
                <div className='flex flex-row items-center relative'>
                    <SearchIcon size={20} className='absolute top-2 right-2' />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type='text'
                        placeholder='Search for people'
                        className='w-full bg-gray-50 text-black p-1 px-4 ml-2 pr-8 border border-gray-300 rounded-xl focus:outline-none shadow-inner'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2 overflow-y-auto pl-5 flex-grow'>
                {loading && (
                    <div className='flex justify-center items-center flex-grow'>
                        <LoaderIcon className='animate-spin' size={24} />
                    </div>
                )}
                {users.map((user) => (
                    <UserEntry key={user.id} user={user} setOpenedUser={setOpenedUser} />
                ))}
            </div>
        </div>
    )
};

const UserEntry = ({ user = {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "PlGIFLs5BV",
    "displayName": "string",
    "iconFileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "bot": true,
    "state": 0,
    "updatedAt": "2025-03-16T10:12:08.939Z"
}, setOpenedUser }) => {
    const [icon, setIcon] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // get user icon
        api.get(`/files/${user?.iconFileId}`, { responseType: 'blob' }).then((response) => {
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
        // check if user is active
        api.get(`/users/${user.id}`).then((response) => {
            console.log('user details');
            console.log(response.data);
            setUserDetails(response.data);
        }).catch((error) => {
            console.error('Error fetching user details:');
            console.error(error);
        }).finally(() => {
        });
    }, [])

    return (
        <div className='flex flex-row items-center gap-2 p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer' onClick={() => {
            if (!userDetails) return;
            api.get(`/users/${user.id}/dm-channel`).then((response) => {
                setOpenedUser({
                    ...userDetails,
                    channelId: response.data.id
                })
             }).catch((error) => {
                console.error('Error fetching user details:');
                console.error(error);
            })
        }}>
            <div>
                <img src={icon} alt='user icon' className='w-10 h-10 rounded-full' />
            </div>
            <div className='flex flex-col'>
                <h3 className='font-semibold text-ellipsis break-all'>{user?.displayName}</h3>
                <div className='flex flex-row items-center gap-1'>
                    {/* if the last online is within 5 minutes from now then i say it's active and show a green cicrle else show a circle with no color*/}
                    <div className={`w-3 h-3 rounded-full bg-${new Date(userDetails?.lastOnline) > new Date(Date.now() - 5 * 60 * 1000 - 3600 * 60) ? 'green-800' : ''} border border-black`} />
                    {/* <div className={`w-3 h-3 rounded-full bg-green-800`} /> */}
                    <p className='text-gray-500 text-ellipsis break-all'>{user.name}</p>
                </div>
            </div>
        </div>
    )
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


export default DmsSideBar;