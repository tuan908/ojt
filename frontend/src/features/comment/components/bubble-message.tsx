import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {useQueryClient} from '@tanstack/react-query';
import {type RefObject, useCallback, useState} from 'react';
import {deleteComment} from '~/app/actions/event';
import json from '~/shared/i18n/locales/ja.json';
import {cn, convertRole} from '~/shared/utils';
import type {ICommentDto} from '../types';

interface IBubbleMessageProps {
  studentEventId: number;
  comment: ICommentDto;
  isCommentOfActiveUser: boolean;
  editState: {
    id: number;
    isEditing: boolean;
  };
  setEditState: (value: {id: number; isEditing: boolean}) => void;
  onEditStart: (data: ICommentDto) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  queryKey: (string | number)[];
}

export default function BubbleMessage({
  studentEventId,
  comment,
  isCommentOfActiveUser,
  setEditState,
  onEditStart,
  inputRef,
  queryKey,
}: IBubbleMessageProps) {
  // Compute `show` dynamically instead of using state
  const [showActions, setShow] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = useCallback(async () => {
    await deleteComment({
      commentId: comment.id!,
      studentEventId,
    });

    queryClient.invalidateQueries({
      queryKey,
      exact: true,
    });
  }, [comment, queryClient]);

  const enableEdit = useCallback(() => {
    setEditState({id: comment.id!, isEditing: true});
    onEditStart({
      id: comment.id,
      content: comment.content,
      username: comment.username,
      name: comment.name,
      roleName: comment.roleName,
      createdAt: comment.createdAt,
    });
    inputRef?.current?.focus();
  }, [comment, setEditState, onEditStart, inputRef]);

  const handleMouseEnter = () => {
    if (isCommentOfActiveUser && !showActions) {
      setShow(true);
    }
  };

  const handleMouseLeave = () => {
    if (!showActions) return;
    setShow(false);
  };

  return (
    <div
      className={cn(
        'w-full flex items-center gap-x-6',
        isCommentOfActiveUser && 'flex-row-reverse',
      )}>
      <div className="w-28">
        <div className="w-full hidden md:flex flex-col gap-y-2 items-center ">
          <Avatar sx={{width: 56, height: 56, bgcolor: '#d87579'}} />
          <span className="block w-28 bg-[#00c853] text-white font-medium rounded-xl text-center px-2 py-2 leading-none">
            {convertRole(comment.roleName)}
          </span>
        </div>
      </div>
      <div className="w-full md:w-1/2 relative">
        <div
          className="bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg hover:cursor-pointer border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <span className="font-semibold text-[#058af4]">{comment.name}</span>
          <span className="py-2">{comment.content}</span>
          <span className="text-[12px]">{comment.createdAt}</span>

          {showActions && (
            <div className="absolute top-1 right-1 flex items-center gap-x-3rounded-md px-2 py-1">
              <Tooltip title={json.common.edit}>
                <button
                  onClick={enableEdit}
                  className="cursor-pointer rounded-full p-1 bg-white">
                  <Edit className="text-icon-default" />
                </button>
              </Tooltip>

              <Tooltip title={json.common.delete}>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer rounded-full p-1 bg-white">
                  <Delete color="error" />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
