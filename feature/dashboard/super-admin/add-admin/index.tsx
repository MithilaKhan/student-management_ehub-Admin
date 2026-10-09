"use client"
import React, { useState } from 'react';
import AddAdminTable from './AddAdminTable';
import HeaderTitle from '@/shared/HeaderTitle';
import AdminModal from '@/ui/modal/AdminModal';

const AddAdmin = () => {
    const [open, setOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className='w-full h-full'> 
        {/* ddad */}
            <div className='flex items-center justify-between mb-6'>
                <HeaderTitle title="Admin List" />
                <button type="submit" className=" bg-[#1A5FA4] h-[40px]  px-6 w-full md:max-w-[200px] rounded-md text-white" onClick={() => setOpen(true)}>
                    + Add Admin
                </button>
            </div>
            <div>
                <AddAdminTable setIsOpen={setOpen} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
            </div>
            <AdminModal isOpen={open} setIsOpen={setOpen} onSuccess={handleRefresh} />
        </div>
    );
};

export default AddAdmin;