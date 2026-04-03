"use client";
import React, { useState } from 'react';
import { Input } from 'antd';
import HeaderTitle from '@/shared/HeaderTitle';
import { FiSearch } from 'react-icons/fi';
import FilteredStudentTable from './FilteredStudentTable';
import StudentCoursesModal from '@/ui/modal/StudentCoursesModal';

const FilteredStudentList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const onRefresh = () => setRefreshTrigger(prev => prev + 1);

    const handleEdit = (student: any) => {
        setSelectedStudent(student);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedStudent(null);
    };

    return (
        <div>
            <div className="">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
                    <HeaderTitle title="Student Deleted List" />

                    <div className="flex md:flex-row flex-col md:items-center justify-end gap-x-3 md:space-y-0 space-y-4 w-full">
                        <Input
                            placeholder="Search"
                            className="md:max-w-[280px] w-full"
                            style={{ height: 40 }}
                            prefix={<FiSearch size={20} />}
                        />

                        <button
                            type="submit"
                            className="bg-[#1A5FA4] h-[40px] w-full md:max-w-[230px] rounded-md text-white"
                            onClick={() => setIsOpen(true)}
                        >
                            + Add Student Courses
                        </button>
                    </div>
                </div>
                <FilteredStudentTable 
                    isOpen={isOpen} 
                    setIsOpen={setIsOpen} 
                    refreshTrigger={refreshTrigger}
                    onEdit={handleEdit}
                    onRefresh={onRefresh}
                />
            </div>
            <StudentCoursesModal 
                isOpen={isOpen} 
                setIsOpen={handleCloseModal} 
                onSuccess={onRefresh}
                initialData={selectedStudent}
            />
        </div>
    );
};

export default FilteredStudentList;