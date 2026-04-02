'use client';
import { ConfigProvider, Menu } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { menuItems } from '@/constants/sidebarData';

interface SidebarProps {
  onCloseDrawer?: () => void;
}

const Sidebar = ({ onCloseDrawer }: SidebarProps) => {
  const path = usePathname() || '/';
  const [selectedKey, setSelectedKey] = useState<string>(path);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const items = menuItems ?? [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setSelectedKey(path);
    const parent = items.find(
      (it) =>
        Array.isArray((it as any).children) &&
        (it as any).children.some((c: any) => c.key === path)
    );
    if (parent) {
      setOpenKeys([parent.key as string]);
    } else {
      const selfParent = items.find(
        (it: any) => it.key === path && Array.isArray((it as any).children)
      );
      if (selfParent) {
        setOpenKeys([selfParent.key as string]);
      } else {
        setOpenKeys([]);
      }
    }
  }, [path, items, mounted]);

  const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys as string[]);
  };

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    setSelectedKey(key);
    onCloseDrawer?.();  
  };

  return (
    <div className="relative h-full pt-8 ps-3 w-full">
      <div className="flex flex-col h-full">

        <Link href="/" className="pb-3 flex-center" onClick={onCloseDrawer}>
          <p className="text-[32px] font-semibold tracking-tight text-[#ABABAB]">e.hub</p>
        </Link>

        <div className="flex-1 overflow-y-auto w-full pr-2 pb-16">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemSelectedBg: '#101010',
                  itemHoverBg: '#101010',
                  itemActiveBg: '#101010',
                  itemSelectedColor: '#F1F1F1',
                  itemBorderRadius: 50,
                  itemHeight: 47,
                },
              },
              token: { colorText: '#ABABAB' }
            }}
          >
            {mounted && (
                <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                onClick={handleClick}
                style={{ borderRightColor: 'transparent', background: 'transparent' }}
                items={items}
                />
            )}
          </ConfigProvider>
        </div>

        <div className="py-3 ps-3 absolute bottom-0 w-full bg-[#1C1C1E]">
          <Link
            href="/login"
            onClick={() => {
              // Clear localStorage and sessionStorage
              localStorage.clear();
              sessionStorage.clear();
              
              // Clear cookies
              document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
              document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
              
              onCloseDrawer?.();
            }}
            className="flex items-center gap-x-2 text-red-500 hover:text-red-600"
          >
            <IoIosLogOut size={18} />
            <span className="font-normal">Logout</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
