"use client"
import React, { useEffect, useState } from 'react'
import { FaRegBell } from 'react-icons/fa6';
import { Badge } from 'antd';
import Link from 'next/link';
import { useUser } from '@/app/providers/UserProvider';
import { fetchUrl } from '@/lib/fetchUrl';

const Header = () => {
    const user = useUser();
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetchUrl('/notification/admin');
            if (res?.success) {
                const list = res?.data?.result || (Array.isArray(res?.data) ? res.data : []);
                const unread = list.filter((item: any) => !item.read).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Failed to fetch unread notifications count:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleNotificationUpdate = () => {
            fetchNotifications();
        };

        window.addEventListener('notification-updated', handleNotificationUpdate);
        return () => {
            window.removeEventListener('notification-updated', handleNotificationUpdate);
        };
    }, []);

    return (
        <div className='flex items-center gap-x-7 justify-end'>
            <Link href="/notification" className='h-fit pt-2'>
                <Badge count={unreadCount} overflowCount={99}>
                    <FaRegBell color="#7a777a" size={24} />
                </Badge>
            </Link>

            <Link href="/profile" className='flex items-center gap-x-3'>
                <img
                    style={{
                        clipPath: "circle()",
                        width: 48,
                        height: 48,
                    }}
                    src={user?.profile || "https://i.pinimg.com/736x/7b/05/51/7b0551406cd7936252123558aacc9191.jpg"}
                    alt={user?.name || "User Avatar"}
                    className='clip object-cover'
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://i.pinimg.com/736x/7b/05/51/7b0551406cd7936252123558aacc9191.jpg";
                    }}
                />
                <div className=' flex flex-col gap-y-0.5'>
                    <p className=' text-[16px] font-medium'>{user?.name || 'Loading...'}</p>
                    <p className=' text-[14px] font-medium'>{user?.email || 'N/A'}</p>
                </div>

            </Link>
        </div>
    )
}

export default Header