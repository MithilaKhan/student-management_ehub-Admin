import HeaderTitle from '@/shared/HeaderTitle';
import React from 'react';
import SubscriptionForm from './SubscriptionForm';
import MonthlySubscriptionTable from './MonthlySubscriptionTable';

interface MonthlySubscriptionFeeProps {
    data: any;
}

const MonthlySubscriptionFee = ({ data }: MonthlySubscriptionFeeProps) => {
    return (
        <div >
            <HeaderTitle title="Monthly Subscription Fees" />
            <div className=' w-full h-full pt-6 md:mb-0 mb-6'>
                <SubscriptionForm />
            </div>
            <div className="w-full h-full pt-3 pb-6 space-y-2">
                <p className="md:text-xl text-lg text-[#1A5FA4]">
                    <span className="">Subscription fee for the month:</span>{' '}
                    <span className="font-medium ">{data?.monthLabel || '-'}</span>
                </p>

                <p className="text-base text-white">
                    Total Income: <span className="font-medium">{data?.totalIncomeBDT || 0} BDT</span>
                </p>

                <p className="text-base text-red-500 ">
                    Total payable amount: <span className="font-medium">{data?.totalPayableAmountBDT || 0} BDT</span>
                </p>

                <p className="text-base text-white">
                    Total number of SMS cost for the month:{' '}
                    <span className="font-medium underline">{data?.totalSmsCostForMonth || '-'}</span>
                </p>

                <p className="text-base text-white">
                    Total SMS cost: <span className="font-medium">{data?.totalSmsCostBDT || 0} BDT</span>
                </p>
            </div>
            <MonthlySubscriptionTable data={data?.smsRows || []} />

        </div>
    );
};

export default MonthlySubscriptionFee;