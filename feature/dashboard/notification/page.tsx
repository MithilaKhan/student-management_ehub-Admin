"use client";
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { fetchUrl } from '@/lib/fetchUrl';
import { Spin } from 'antd';
import toast from 'react-hot-toast';

const Notification = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingRead, setMarkingRead] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await fetchUrl('/notification/admin');
            if (res?.success) {
                const list = res?.data?.result || (Array.isArray(res?.data) ? res.data : []);
                setNotifications(list);
            }
        } catch (error: any) {
            console.error('Failed to fetch notifications:', error);
            toast.error(error?.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            setMarkingRead(true);
            const res = await fetchUrl('/notification/admin', {
                method: 'PATCH'
            });
            if (res?.success) {
                toast.success('All notifications marked as read');
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                window.dispatchEvent(new CustomEvent('notification-updated'));
            } else {
                toast.error(res?.message || 'Failed to mark notifications as read');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to mark notifications as read');
        } finally {
            setMarkingRead(false);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="mt-5">
            <div>
                <div className="flex items-center justify-between my-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-primary">Notification</h1>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={markingRead}
                            className="text-sm text-[#1A5FA4] hover:text-[#3880c9] font-medium cursor-pointer transition-colors disabled:opacity-50"
                        >
                            {markingRead ? 'Marking...' : 'Mark all as read'}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Spin size="large" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 text-[#8a8787] bg-[#27272a] rounded-lg">
                        <p className="text-lg">No notifications yet</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((item: any, index: number) => {
                            const isUnread = !item.read;
                            return (
                                <div
                                    key={item._id || index}
                                    className={`w-full mx-auto p-4 my-3 rounded-md transition-colors min-h-20 shadow-md ${
                                        isUnread ? 'bg-[#3b3b3e] border-l-4 border-[#1A5FA4]' : 'bg-[#333335]'
                                    }`}
                                >
                                    <div className="text-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {isUnread && (
                                                    <span className="w-2 h-2 rounded-full bg-[#1A5FA4] inline-block" />
                                                )}
                                                <p className="font-semibold text-white">
                                                    {item?.title || item?.screen || 'System Notification'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-[#bdbaba] text-xs">
                                                <span>{moment(item?.createdAt).format('DD-MM-YYYY')}</span>
                                                <span>{moment(item?.createdAt).format('hh:mm A')}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-[#bebcbc]">
                                            <p className="text-sm leading-relaxed">{item?.text}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;