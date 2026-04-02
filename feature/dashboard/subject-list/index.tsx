"use client";
import React, { useState } from 'react';
import { Input } from 'antd';
import HeaderTitle from '@/shared/HeaderTitle';
import SubjectListTable from './SubjectListTable';
import { FiSearch } from 'react-icons/fi';
import SubjectListModal from '@/ui/modal/SubjectListModal';
// import { SubjectListType } from '@/type';

const SubjectList = ({ initialData }: { initialData?: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<any>(null);

    return (
        <div>
            <div className="">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
                    <HeaderTitle title="Subject List" />

                    <div className="flex md:flex-row flex-col md:items-center justify-end gap-x-3 md:space-y-0 space-y-4 w-full">
                        <Input
                            placeholder="Search"
                            className="md:max-w-[280px] w-full"
                            style={{ height: 40 }}
                            prefix={<FiSearch size={20} />}
                        />

                        <button
                            type="button"
                            className="bg-[#1A5FA4] h-[40px]  w-full md:max-w-[200px] rounded-md text-white"
                            onClick={() => {
                                setEditingSubject(null);
                                setIsOpen(true);
                            }}
                        >
                            + Add Subject
                        </button>
                    </div>
                </div>
                <SubjectListTable 
                    isOpen={isOpen} 
                    setIsOpen={setIsOpen} 
                    dataSource={initialData} 
                    setEditingSubject={setEditingSubject} 
                />
            </div>
            <SubjectListModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                editingSubject={editingSubject} 
                setEditingSubject={setEditingSubject} 
            />
        </div>
    );
};

export default SubjectList;