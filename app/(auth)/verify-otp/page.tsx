import VerifyOtp from '@/feature/auth/VerifyOtp/VerifyOtp';
import React, { Suspense } from 'react';

const VerifyOTPPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
                <VerifyOtp />
            </Suspense>
        </div>
    );
};

export default VerifyOTPPage;