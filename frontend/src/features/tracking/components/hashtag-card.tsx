import Box from '~/shared/components/legacy/box';
import {IHashtagDto} from '~/shared/types';

export default function HashtagCard({hashtags}: {hashtags: IHashtagDto[]}) {
  return (
    <Box width={48} height={20} backgroundColor="#ffffff">
      <ul className="w-full h-full grid grid-cols-2 px-8 xl:px-10 gap-y-4 place-content-center place-items-center">
        {hashtags.map(label => (
          <li
            key={label.id}
            className="w-full text-left flex gap-x-4 items-center">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: label.color,
              }}></span>
            <span style={{color: label.color}}>{label.name}</span>
          </li>
        ))}
      </ul>
    </Box>
  );
}
