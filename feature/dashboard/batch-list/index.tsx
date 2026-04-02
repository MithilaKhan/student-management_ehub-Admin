"use client";
import React, { useState } from 'react';
import { Input } from 'antd';
import HeaderTitle from '@/shared/HeaderTitle';
import { FiSearch } from 'react-icons/fi';
import BatchListTable from './BatchListTable';
import BatchListModal from '@/ui/modal/BatchListModal';

const BatchList = ({ initialData }: { initialData?: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<any>(null);

    return (
        <div>
            <div className="">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
                    <HeaderTitle title="Batch List" />

                    <div className="flex md:flex-row flex-col md:items-center justify-end gap-x-3 md:space-y-0 space-y-4 w-full">
                        <Input
                            placeholder="Search"
                            className="md:max-w-[280px] w-full"
                            style={{ height: 40 }}
                            prefix={<FiSearch size={20} />}
                        />

                        <button
                            type="button"
                            className="bg-[#1A5FA4] h-[40px] w-full md:max-w-[200px] rounded-md text-white"
                            onClick={() => {
                                setEditingBatch(null);
                                setIsOpen(true);
                            }}
                        >
                            + Add Batch
                        </button>
                    </div>
                </div>
                <BatchListTable 
                    isOpen={isOpen} 
                    setIsOpen={setIsOpen} 
                    dataSource={initialData} 
                    setEditingBatch={setEditingBatch} 
                />
            </div>
            
            <BatchListModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                editingBatch={editingBatch} 
                setEditingBatch={setEditingBatch} 
            />
        </div>
    );
};

export default BatchList;