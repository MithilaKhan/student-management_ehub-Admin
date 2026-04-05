"use client";
import HeaderTitle from '@/shared/HeaderTitle';
import React, { useState } from 'react';
import AssignToCourseForm from './AssignToCourseForm';
import ClassRoutineModal from '@/ui/modal/ClassRoutineModal';

interface AssignToCourseProps {
    initialData: {
        students: any[];
        subjects: any[];
        batches: any[];
        sections: any[];
    };
}

const AssignToCourse = ({ initialData }: AssignToCourseProps) => { 
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className=' w-full h-full'>
            <div className='flex md:flex-row flex-col md:items-center justify-between md:space-y-0 space-y-4 mb-6'>
                <HeaderTitle title="Enrol Student to Course" />
                <button type="submit" className=" bg-[#198754] h-[40px]  px-6 w-full md:max-w-[200px] rounded-md text-white" onClick={() => setIsOpen(true)}>
                    View Class Routine
                </button>
            </div>

            <div className=" h-[70vh] ">
                <div className='flex-center w-full h-full '>
                    <AssignToCourseForm initialData={initialData} />
                </div>
            </div> 
            <ClassRoutineModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
};

export default AssignToCourse;