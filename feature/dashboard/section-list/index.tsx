"use client";
import React, { useState } from 'react';
import { Input } from 'antd';
import HeaderTitle from '@/shared/HeaderTitle';
import { FiSearch } from 'react-icons/fi';
import SectionListTable from './SectionListTable';
import SectionListModal from '@/ui/modal/SectionListModal';

interface SectionListProps {
    data: any[];
}

const SectionList = ({ data }: SectionListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any>(null);

    return (
        <div>
            <div className="">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
                    <HeaderTitle title="Section List" />

                    <div className="flex md:flex-row flex-col md:items-center justify-end gap-x-3 md:space-y-0 space-y-4 w-full">
                        <Input
                            placeholder="Search"
                            className="md:max-w-[280px] w-full"
                            style={{ height: 40 }}
                            prefix={<FiSearch size={20} />}
                        />

                        <button
                            type="submit"
                            className="bg-[#1A5FA4] h-[40px] w-full md:max-w-[200px] rounded-md text-white"
                            onClick={() => {
                                setIsOpen(true);
                                setSelectedSection(null);
                            }}
                        >
                            + Add Section
                        </button>
                    </div>
                </div>

                <SectionListTable 
                  isOpen={isOpen} 
                  setIsOpen={setIsOpen} 
                  data={data} 
                  setSelectedSection={setSelectedSection} 
                />
            </div>
            <SectionListModal 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              selectedSection={selectedSection} 
            />
        </div>
    );
};

export default SectionList;