'use client';

import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tooltip,
} from '@mui/material';
import {ArrowLeft, CirclePower, CircleUser, LogOut} from 'lucide-react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {use, useMemo, useState} from 'react';
import {logOut} from '~/app/actions/auth';
import {Route, UserRole} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {convertRole} from '~/shared/utils';
import type {ISession} from '../lib/session';

export default function Navbar({
  sessionPromise,
}: {
  sessionPromise: Promise<ISession | undefined>;
}) {
  const session = use(sessionPromise);
  const router = useRouter();
  const pathname = usePathname();
  const href = useMemo(
    () =>
      session?.role !== UserRole.Student
        ? Route.Students
        : `/students/${session?.code}`,
    [session],
  );
  const roleName = convertRole(session?.role!);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openActionMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logOut();
  };

  const isShowBackButton = useMemo(() => {
    if (
      (pathname === '/students' && session?.role !== UserRole.Student) ||
      (pathname.startsWith('/students/') && session?.role === UserRole.Student)
    )
      return false;
    return true;
  }, []);

  return (
    <nav className="w-full py-2 px-4 flex justify-between items-center z-50 fixed top-0 left-0 shadow-md bg-white">
      <div className="flex flex-row gap-x-4 items-center">
        <Link className="text-[#1f5da3] font-extrabold text-3xl" href={href}>
          {json.common.appName}
        </Link>
      </div>

      <div className="hidden items-center justify-between gap-x-2 lg:flex">
        <div className="flex">
          {/* Back Button */}
          {isShowBackButton && (
            <div
              className="border-r px-2 hover:cursor-pointer"
              onClick={() => router.back()}>
              <Tooltip title={json.common.logout}>
                <ArrowLeft className="text-icon-default" size="2.5rem" />
              </Tooltip>
            </div>
          )}

          <div
            className="border-r px-2 hover:cursor-pointer"
            onClick={handleLogout}>
            <Tooltip title={json.common.logout}>
              <CirclePower className="text-icon-default" size="2.5rem" />
            </Tooltip>
          </div>
        </div>

        <button className="pr-2 cursor-pointer" onClick={handleClick}>
          <CircleUser className="text-icon-default" size="3rem" />
        </button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openActionMenu}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}>
          <MenuList dense>
            <MenuItem onClick={handleClose}>
              {session?.name ?? 'ゲスト'}としてサインイン
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOut className="text-icon-default" size={24} />
              </ListItemIcon>
              <ListItemText>{json.common.logout}</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Username */}
        <div className="flex flex-col">
          <h1 className="text-xl font-normal text-[#abb7bc]">
            {json.common.hello} {session?.name ?? 'ゲスト'}
          </h1>
          <h1 className="text-[#c3cbcf]">{roleName}</h1>
        </div>
      </div>
    </nav>
  );
}
