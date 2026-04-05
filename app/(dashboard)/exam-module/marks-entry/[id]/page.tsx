import { fetchServer } from '@/lib/fetchServer';
import EditMarksEntry from '@/feature/dashboard/exam-module/marks-entry/edit-marks';
import React from 'react';

const EditMarksEntryPage = async ({ params }: { params: { id: string } }) => {
    const res = await fetchServer(`/marksEntry/${params.id}`);
    const data = res?.data || null;

    return (
        <div>
            <EditMarksEntry data={data} id={params.id} />
        </div>
    );
};

export default EditMarksEntryPage;
