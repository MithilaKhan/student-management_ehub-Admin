import SectionList from '@/feature/dashboard/section-list';
import { fetchServer } from '@/lib/fetchServer';
import React from 'react';

const sectionListPage = async () => {
    const response = await fetchServer('/section');
    const sections = response?.data || [];
    
    return (
        <div>
           <SectionList data={sections} />
        </div>
    );
};

export default sectionListPage;