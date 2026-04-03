import Header from '@/shared/Header';
import Sidebar from '@/shared/Sidebar';
import { ConfigProvider } from 'antd';
import HeaderDrawerWrapper from '@/ui/HeaderDrawerWrapper';
import { fetchServer } from '@/lib/fetchServer';
import { UserProvider } from '@/app/providers/UserProvider';

export const dynamic = 'force-dynamic';

const layout = async ({ children }: { children: React.ReactNode }) => {
    
    // Server-Side Data Fetching for User Profile with automated token injection
    let userProfile = null;
    try {
        const response = await fetchServer('/user/profile');
        if (response?.success) {
            userProfile = response.data;
        }
    } catch (error) {
        console.error("Failed to fetch user profile in layout:", error);
        // the fetchUrl automatically handles 401s by redirecting to login.
    }

    return (
        <UserProvider user={userProfile}>
            <div className="grid grid-cols-12 text-[#ABABAB] bg-black">

                {/* Desktop Sidebar */}
                <div className="hidden md:block col-span-2 h-screen bg-[#1C1C1E] overflow-x-hidden">
                    <Sidebar  />
                </div>

                {/* Main container */}
                <div className="col-span-12 md:col-span-10 p-4 h-[100vh]">
                    <div className="h-[78px] flex items-center justify-between md:justify-end md:pr-5 pr-2 bg-[#1C1C1E] rounded-md ps-2"> 
                        <HeaderDrawerWrapper />
                        <Header />
                    </div>

                    {/* Content */}
                    <div className="pt-4 h-[calc(100vh-95px)]">
                        <div className="h-full overflow-y-auto rounded-md bg-[#1C1C1E] md:p-5 p-2">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Select: {
                                        clearBg: "transparent",
                                        selectorBg: "#ffffff1a",
                                        activeBorderColor: "transparent",
                                        activeOutlineColor: "transparent",
                                        colorText: "#ffffff",
                                        optionSelectedBg: "#7c7c7f",
                                    },
                                },
                                token: {
                                    colorPrimary: '#ffffff1a',
                                    colorIcon: 'white',
                                    colorBgBase: '#333335',
                                    colorText: 'white',
                                    colorTextPlaceholder: '#9CA3AF',
                                },
                            }}
                        >
                            {children}
                        </ConfigProvider>
                    </div>
                </div>
            </div>
        </div>
        </UserProvider>
    );
};

export default layout;
