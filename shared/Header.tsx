"use client"
import React from 'react'
import { FaRegBell } from 'react-icons/fa6';
import { Badge } from 'antd';
import Link from 'next/link';
import { useUser } from '@/app/providers/UserProvider';

const Header = () => {
    const user = useUser();

    return (
        <div className='flex items-center gap-x-7 justify-end'>
            <Link href="/notification" className='h-fit pt-2'>
                <Badge count={1} >
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