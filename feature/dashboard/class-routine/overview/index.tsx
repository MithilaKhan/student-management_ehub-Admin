"use client";
import React, { useState } from 'react';
import { Input } from 'antd';
import HeaderTitle from '@/shared/HeaderTitle';
import { FiSearch } from 'react-icons/fi';
import OverviewTable from './OverviewTable';
import OverviewModal from '@/ui/modal/OverviewModal';

interface OverviewProps {
    data: any[];
}

const Overview = ({ data }: OverviewProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

    return (
        <div>
            <div className="">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
                    <HeaderTitle title="Routine List" />

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
                                setSelectedRoutine(null);
                                setIsOpen(true);
                            }}
                        >
                            + Add Routine
                        </button>
                    </div>
                </div>
                <OverviewTable 
                    data={data} 
                    setIsOpen={setIsOpen} 
                    setSelectedRoutine={setSelectedRoutine} 
                />
            </div>
            <OverviewModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                selectedRoutine={selectedRoutine} 
            />
        </div>
    );
};

export default Overview;