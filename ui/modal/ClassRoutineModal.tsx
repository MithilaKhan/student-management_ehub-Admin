"use client";
import React, { useEffect, useState } from 'react';
import { modalType } from '@/type';
import { Modal, Select, Spin, Table } from 'antd';
import { fetchUrl } from '@/lib/fetchUrl';

const ClassRoutineModal = ({ isOpen, setIsOpen }: modalType) => {
    const [routines, setRoutines] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoutineId, setSelectedRoutineId] = useState<string>('all');

    useEffect(() => {
        if (isOpen) {
            const fetchRoutines = async () => {
                try {
                    setLoading(true);
                    const res = await fetchUrl('/routine');
                    if (res?.success && Array.isArray(res?.data)) {
                        setRoutines(res.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch class routines:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRoutines();
        }
    }, [isOpen]);

    const activeRoutines = routines.filter(r => r.isActive !== false);

    const getDaySchedule = (routine: any, dayCode: string) => {
        if (!Array.isArray(routine.day)) return '';
        const dayIdx = routine.day.findIndex((d: string) => d?.toUpperCase() === dayCode);
        if (dayIdx === -1) return '';
        const start = routine.startTime?.[dayIdx] || '';
        const end = routine.endTime?.[dayIdx] || '';
        if (start && end) return `${start} to\n${end}`;
        if (start) return start;
        return 'Class Scheduled';
    };

    const displayedRoutines = selectedRoutineId === 'all'
        ? activeRoutines
        : activeRoutines.filter(r => r._id === selectedRoutineId);

    const dataSource = displayedRoutines.map((routine, index) => ({
        id: index + 1,
        key: routine._id || index,
        title: `${routine.subjectName?.name || routine.name || 'Routine'}${routine.batchName?.name ? ` (${routine.batchName.name})` : ''}`,
        sat: getDaySchedule(routine, 'SAT'),
        sun: getDaySchedule(routine, 'SUN'),
        mon: getDaySchedule(routine, 'MON'),
        tue: getDaySchedule(routine, 'TUE'),
        wed: getDaySchedule(routine, 'WED'),
        thu: getDaySchedule(routine, 'THU'),
        fri: getDaySchedule(routine, 'FRI'),
    }));

    const columns = [
        {
            title: 'SL',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Course / Batch',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => (
                <span className="text-white font-medium text-xs">{text}</span>
            ),
        },
        {
            title: 'SAT',
            dataIndex: 'sat',
            key: 'sat',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
        {
            title: 'SUN',
            dataIndex: 'sun',
            key: 'sun',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
        {
            title: 'MON',
            dataIndex: 'mon',
            key: 'mon',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
        {
            title: 'TUE',
            dataIndex: 'tue',
            key: 'tue',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
        {
            title: 'WED',
            dataIndex: 'wed',
            key: 'wed',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
        {
            title: 'THU',
            dataIndex: 'thu',
            key: 'thu',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
        {
            title: 'FRI',
            dataIndex: 'fri',
            key: 'fri',
            render: (text: string) => (
                <div className="whitespace-pre-line text-xs">{text || '---'}</div>
            ),
        },
    ];

    const routineOptions = [
        { label: 'All Active Routines', value: 'all' },
        ...activeRoutines.map(r => ({
            label: `${r.subjectName?.name || r.name || 'Routine'}${r.batchName?.name ? ` - ${r.batchName.name}` : ''}`,
            value: r._id,
        })),
    ];

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            width={840}
            className="custom-black-modal"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pt-2">
                <h3 className="text-white text-lg font-medium">Class Routine Schedule</h3>
                {activeRoutines.length > 0 && (
                    <Select
                        value={selectedRoutineId}
                        onChange={setSelectedRoutineId}
                        options={routineOptions}
                        className="custom-dark-select w-full sm:w-[280px]"
                        placeholder="Filter Routine"
                    />
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Spin size="large" />
                </div>
            ) : dataSource.length === 0 ? (
                <div className="text-center py-12 text-[#8a8787]">
                    No class routines available
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    scroll={{ x: "max-content" }}
                    className="custom-table"
                    rowKey="key"
                />
            )}
        </Modal>
    );
};

export default ClassRoutineModal;