"use client";

import React from 'react';
import { Input } from 'antd';
import HeaderTitle from '@/shared/HeaderTitle';
import { FiSearch } from 'react-icons/fi';
import FilteredWaitingTable from './FilteredWaitingTable';

const FilteredWaitingList = () => {
    return (
        <div>
            <div className="">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:space-y-0 space-y-4 mb-6">
                    <HeaderTitle title="Filtered Waiting List" />

                    <div className="flex md:flex-row flex-col md:items-center justify-end gap-x-3 md:space-y-0 space-y-4 w-full">
                        <Input
                            placeholder="Search"
                            className="md:max-w-[280px] w-full"
                            style={{ height: 40 }}
                            prefix={<FiSearch size={20} />}
                        />
                    </div>
                </div>
                <FilteredWaitingTable />
            </div>
        </div>
    );
};

export default FilteredWaitingList;
