import {CircleUserRound} from 'lucide-react';
import json from '~/shared/i18n/locales/ja.json';

export default function StudentCard({
  code,
  name,
}: {
  code: string;
  name: string;
}) {
  return (
    <div className="w-1/3 h-full bg-white rounded-2xl">
      <div className="bg-[#92cdfa] h-[30%] rounded-t-2xl"></div>
      <div className="w-full h-[70%] flex flex-col px-4">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full grid grid-cols-[2fr_1fr] place-items-center">
            <div className="grid grid-cols-[0.25fr_auto_2fr] gap-x-2 gap-y-2 text-start font-semibold text-lg text-[#060b0f] whitespace-nowrap">
              <span>{json.tableHeader.event.code}</span>
              <span>:</span>
              <span>{code}</span>
              <span>{json.tableHeader.event.name}</span>
              <span>:</span>
              <span>{name}</span>
            </div>
            <div className="flex justify-center items-center">
              <CircleUserRound size="10rem" className="text-icon-default" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
