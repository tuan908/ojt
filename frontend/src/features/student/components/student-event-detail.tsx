'use client';

import EmojiPicker from '@emoji-mart/react';
import {SentimentSatisfiedAlt} from '@mui/icons-material';
import {
  Autocomplete,
  Avatar,
  Backdrop,
  Button,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  type AutocompleteChangeReason,
  type AutocompleteInputChangeReason,
  type SelectProps,
} from '@mui/material';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {X as Close, Send} from 'lucide-react';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type SyntheticEvent,
} from 'react';
import {
  createStudentEvent,
  editStudentEvent,
  getStudentEvent,
} from '~/app/actions/event';
import BubbleMessage from '~/features/comment/components/bubble-message';
import type {ICommentDto} from '~/features/comment/types';
import Textarea from '~/shared/components/legacy/textarea';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from '~/shared/components/ui/dialog';
import ProgressIndicator from '~/shared/components/ui/progress';
import {menuProps, QUERY_KEY, ScreenMode, UserRole} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {client} from '~/shared/lib/hono-client';
import type {ISession} from '~/shared/lib/session';
import type {IEventDto, IHashtagDto} from '~/shared/types';

interface IStudentEventDetailProps {
  studentCode: string;
  studentEventId: number;
  screenMode: string;
  events: IEventDto[];
  hashtags: IHashtagDto[];
  session: ISession;
}

interface IEditCommentState {
  id: number;
  isEditing: boolean;
}

const initEditState: IEditCommentState = {
  id: -1,
  isEditing: false,
};

export default function StudentEventDetail({
  events,
  hashtags,
  studentEventId,
  screenMode,
  studentCode,
  session,
}: IStudentEventDetailProps) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => [QUERY_KEY.EVENT, studentCode, studentEventId],
    [],
  );

  const {data: studentEvent} = useQuery({
    queryKey: [QUERY_KEY.EVENT, studentCode, screenMode, studentEventId],
    queryFn: async () => {
      const response = await getStudentEvent({
        studentCode,
        studentEventId: String(studentEventId),
      });

      return response!;
    },
  });

  const {data: commentResults, isLoading: isLoadingComments} = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await client.comments.$get({
        query: {
          student_event_id: Number(studentEventId),
        },
      });

      if (!response.ok) {
        return [];
      }

      const responseJson = await response.json();
      return responseJson?.data ?? [];
    },
  });

  const [studentEventData, setStudentEventData] = useState(
    () => studentEvent!?.data!,
  );

  useEffect(() => {
    if (studentEvent) {
      setStudentEventData(studentEvent?.data!);
    }
  }, [studentEvent]);

  const [error, setError] = useState(false);
  const [disable, setDisable] = useState(false);
  const [openPicker, setOpen] = useState(false);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<ICommentDto | null>(
    null,
  );
  const [editState, setEditState] = useState<IEditCommentState>(initEditState);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDirty] = useState(false);

  useEffect(() => {
    if (screenMode === ScreenMode.CHAT.toString()) {
      setDisable(true);
    }
  }, []);

  // Update the input change handler to work with both states
  function handleInputCommentChange(
    event: SyntheticEvent,
    input: string | {label: string; value: string} | null,
    reason: AutocompleteInputChangeReason,
  ): void {
    event?.preventDefault();
    if (input === null) {
      return;
    }

    const content = typeof input === 'string' ? input : input.value;

    // Update the appropriate state based on editing mode
    if (editState.isEditing && editingComment) {
      setEditingComment({
        ...editingComment,
        content,
      });
    } else {
      setNewComment(content);
    }

    // Handle hashtag suggestions
    if (content.startsWith('#') && session?.role === UserRole.Counselor) {
      setOpenSuggest(true);
    }

    if (reason === 'reset') {
      setOpenSuggest(false);
    }
  }

  // Update the change handler similarly
  function handleChangeComment(
    event: SyntheticEvent<Element, Event>,
    input: NonNullable<string | {id: number; label: string}>,
    reason: AutocompleteChangeReason,
  ): void {
    event?.preventDefault();
    let content = [];
    if (typeof input === 'string') {
      content.push(input);
    } else if (typeof input === 'object') {
      content.push(input.label);
    }

    const finalContent = content.join(',');

    // Update the appropriate state based on editing mode
    if (editState.isEditing && editingComment) {
      setEditingComment({
        ...editingComment,
        content: finalContent,
      });
    } else {
      setNewComment(finalContent);
    }

    if (reason === 'selectOption' && openSuggest) {
      setOpenSuggest(false);
    }
  }

  const handleSelectChange: SelectProps<string>['onChange'] = e => {
    if (disable) return;
    if (error) {
      setError(false);
      return;
    }
    setStudentEventData(x => ({...x, eventName: e.target.value}));
  };

  const handleChange: ComponentProps<'textarea'>['onChange'] = e => {
    e?.preventDefault();
    setStudentEventData({
      ...studentEventData,
      [e?.target.name]: e?.target.value!,
    });
  };

  async function handleMutation(e: SyntheticEvent<HTMLButtonElement>) {
    e?.preventDefault();
    setEditingComment(null);
    setNewComment('');
    if (screenMode === ScreenMode.NEW.toString()) {
      await createStudentEvent({
        data: studentEventData,
        gradeName: session?.grade,
        studentCode: session?.code,
        username: session?.username,
      });
    } else {
      await editStudentEvent({
        id: studentEventId,
        username: session?.username!,
        data: studentEventData,
        studentCode: session?.code!,
        gradeName: session?.grade!,
      });
    }
    startTransition(async () => {
      const updatedValues = await getStudentEvent({
        studentCode,
        studentEventId: String(studentEventId),
      });
      await queryClient.setQueryData(
        [QUERY_KEY.EVENT, studentCode, screenMode, studentEventId],
        updatedValues,
      );
    });
  }

  async function handleAddComment(
    event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event?.preventDefault();

    if (!newComment.trim() || !session?.username) {
      return;
    }

    const json = {
      content: newComment,
      studentEventId,
      username: session.username,
    };

    await client.comments.$post({
      json,
    });

    const response = await client.comments.$get({
      query: {
        student_event_id: Number(studentEventId),
      },
    });

    const responseJson = await response.json();

    queryClient.setQueryData(queryKey, responseJson?.data ?? []);

    startTransition(() => {
      setNewComment('');
      if (openSuggest) {
        setOpenSuggest(false);
      }
    });
  }

  // Separate function for updating an existing comment
  async function handleEditComment(
    event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event?.preventDefault();

    if (!editingComment || !editingComment?.content!?.trim()) {
      return;
    }

    const json = {
      commentId: editingComment.id!,
      content: editingComment?.content!,
      studentEventId: Number(studentEventId),
    };

    await client.comments[':id'].$put(
      {
        param: {id: editingComment.id!?.toString()},
      },
      {
        init: {
          body: JSON.stringify(json),
        },
      },
    );

    await queryClient.invalidateQueries({
      queryKey,
    });

    startTransition(() => {
      setEditingComment(null);
      setEditState(initEditState);
      if (openSuggest) {
        setOpenSuggest(false);
      }
    });
  }

  // Function to start editing a comment
  function startEditComment(comment: ICommentDto) {
    setEditingComment(comment);
    setEditState({
      id: comment.id!,
      isEditing: true,
    });
  }

  // Function to cancel editing
  function cancelEditComment() {
    setEditingComment(null);
    setEditState(initEditState);
  }

  // Handle emoji selection
  function handleSelect(emoji: any) {
    if (!emoji?.native) return;

    if (editState.isEditing && editingComment) {
      setEditingComment({
        ...editingComment,
        content: editingComment?.content!?.concat(emoji.native),
      });
    } else {
      setNewComment(newComment.concat(emoji.native));
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const commentRef = useRef<HTMLInputElement>(null);

  const isSelectDisabled = useMemo(
    () =>
      disable ||
      screenMode === ScreenMode.EDIT.toString() ||
      (session?.role === UserRole.Student.toString() &&
        screenMode !== ScreenMode.NEW.toString()),
    [disable, screenMode, session],
  );

  const renderComments = useCallback(() => {
    const isHideComments = screenMode !== ScreenMode.CHAT.toString();
    if (isHideComments) return null;

    return (
      <>
        <div className="w-full md:w-1/2 m-auto flex flex-col gap-y-4 relative">
          {commentResults?.map(comment => {
            return (
              <BubbleMessage
                key={comment.id}
                queryKey={queryKey}
                comment={comment}
                onEditStart={() => startEditComment(comment)}
                editState={editState}
                setEditState={setEditState}
                isCommentOfActiveUser={
                  session?.username! === comment?.username!
                }
                inputRef={commentRef!}
                studentEventId={studentEventId}
              />
            );
          })}
        </div>

        {/* Rest of your rendering code */}
        <div className="w-11/12 md:w-3/5 m-auto flex items-center gap-x-2 md:gap-x-8">
          <Avatar className="!hidden md:!flex md:!w-16 md:!h-16" />
          <div className="w-full flex items-center relative">
            <Autocomplete
              className="w-full"
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  flexWrap: 'nowrap',
                  bgcolor: '#ffffff',
                  paddingX: 1,
                },
              }}
              options={hashtags?.map(x => ({
                id: x.id,
                label: x.name,
              }))}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={json.event.addComment}
                  multiline
                  variant="outlined"
                  rows={2}
                  inputRef={inputRef}
                  sx={{
                    padding: 0,
                    fontSize: 1,
                  }}
                />
              )}
              onInputChange={handleInputCommentChange}
              onChange={handleChangeComment}
              open={openSuggest}
              inputValue={
                editState.isEditing ? editingComment?.content || '' : newComment
              }
              disableListWrap
              disableClearable
              disablePortal
              freeSolo
            />
            <Tooltip title={json.common.emoji}>
              <button
                onClick={() => setOpen(!openPicker)}
                className="absolute top-1 right-2 z-50">
                <SentimentSatisfiedAlt sx={{width: 22, height: 22}} />
              </button>
            </Tooltip>
            {openPicker ? (
              <div className="absolute -right-12 -top-0 lg:top-0">
                <EmojiPicker
                  data={async () => {
                    const data = (await import('@emoji-mart/data')).default;
                    return data;
                  }}
                  onEmojiSelect={handleSelect}
                  open={openPicker}
                  previewPosition="none"
                  onClickOutside={() => setOpen(false)}
                />
              </div>
            ) : null}
          </div>

          {/* Update the action buttons */}
          {editState.isEditing ? (
            <>
              <button
                className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                onClick={handleEditComment}
                disabled={
                  !editingComment?.content ||
                  editingComment.content.length === 0
                }>
                <Send size={32} className="text-icon-default" />
              </button>
              <button
                className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3"
                onClick={cancelEditComment}>
                <Close className="text-icon-default" size={32} />
              </button>
            </>
          ) : (
            <button
              className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
              onClick={handleAddComment}
              disabled={newComment.length === 0}>
              <Send size={32} className="text-icon-default" />
            </button>
          )}
        </div>
      </>
    );
  }, [
    screenMode,
    startEditComment,
    editState,
    setEditState,
    session,
    commentRef,
    editingComment,
    newComment,
    openPicker,
    openSuggest,
    handleInputCommentChange,
    handleChangeComment,
    handleEditComment,
    cancelEditComment,
    handleAddComment,
  ]);

  useEffect(() => {
    if (isDirty && !openDialog) {
      setOpenDialog(true);
    }
  }, [isDirty]);

  if (isLoadingComments)
    return (
      <Backdrop open={isLoadingComments}>
        <ProgressIndicator />
      </Backdrop>
    );

  return (
    <div className="flex flex-col w-full pt-20 pb-10">
      <div className="pt-6 w-full flex flex-col gap-y-4 relative">
        <div className="w-4/5 md:w-1/2 m-auto bg-white rounded-xl shadow-sm">
          <div className="w-[90%] m-auto flex flex-col gap-y-4 py-6">
            {/* Select */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="selectEvent">{json.event.selectEvent}</label>
              <Select
                variant="outlined"
                className="w-full border-default disabled:cursor-not-allowed"
                value={studentEventData?.eventName ?? json.event.placeholder0}
                sx={{bgcolor: '#ffffff', paddingX: 1}}
                MenuProps={menuProps}
                onChange={handleSelectChange}
                disabled={isSelectDisabled}>
                <MenuItem value={studentEventData?.eventName} disabled>
                  {studentEventData?.eventName ?? json.event.placeholder0}
                </MenuItem>
                {events!?.map(x => (
                  <MenuItem
                    key={x.id}
                    value={x.name}
                    disableRipple
                    disableTouchRipple>
                    {x.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {error ? (
              <span className="text-red-500 text-sm">
                Must select an event!
              </span>
            ) : null}

            {/* Events in school life */}
            <div className="flex flex-col gap-y-3">
              <label htmlFor="eventsInSchoolLife">{json.event.question1}</label>
              <Textarea
                name="eventsInSchoolLife"
                placeholder={json.event.placeholder1}
                onChange={handleChange}
                value={studentEventData!?.eventsInSchoolLife}
                disabled={disable}
              />
            </div>

            {/* My Actions */}
            <div className="flex flex-col gap-y-3">
              <label htmlFor="eventsInSchoolLife">{json.event.question2}</label>
              <Textarea
                name="myAction"
                placeholder={json.event.placeholder2}
                onChange={handleChange}
                value={studentEventData!?.myAction}
                disabled={disable}
              />
            </div>

            {/* Shown power */}
            <div className="flex flex-col gap-y-3">
              <label htmlFor="eventsInSchoolLife">{json.event.question3}</label>
              <Textarea
                name="shownPower"
                placeholder={json.event.placeholder3}
                onChange={handleChange}
                value={studentEventData!?.shownPower}
                disabled={disable}
              />
            </div>

            {/* Strength that has grown */}
            <div className="flex flex-col gap-y-3">
              <label htmlFor="eventsInSchoolLife">{json.event.question4}</label>
              <Textarea
                name="strengthGrown"
                placeholder={json.event.placeholder4}
                onChange={handleChange}
                value={studentEventData!?.strengthGrown}
                disabled={disable}
              />
            </div>

            {/* What I thought */}
            <div className="flex flex-col gap-y-3">
              <label htmlFor="eventsInSchoolLife">{json.event.question5}</label>
              <Textarea
                name="myThought"
                placeholder={json.event.placeholder5}
                onChange={handleChange}
                value={studentEventData!?.myThought}
                disabled={disable}
              />
            </div>

            {session?.role === UserRole.Student &&
            [ScreenMode.NEW.toString(), ScreenMode.EDIT.toString()].includes(
              screenMode!,
            ) ? (
              <button
                className="w-full border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer disabled:cursor-not-allowed bg-[#4285f4]"
                onClick={async e => handleMutation(e)}
                disabled={disable || error}>
                {screenMode !== ScreenMode.NEW.toString() ? (
                  <span>更新</span>
                ) : (
                  <span>追加</span>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {renderComments()}

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogOverlay>
            <DialogHeader>
              <DialogTitle>{json.dialog.confirmation}</DialogTitle>
            </DialogHeader>
            <DialogContent>
              <p className="text-red-400 text-xl text-wrap">
                {json.dialog.unsavedChanges}
              </p>
            </DialogContent>
            <DialogFooter>
              <Button onClick={() => {}}>{json.dialog.cancel}</Button>
              <Button onClick={() => {}}>
                {json.dialog.exitWithoutSaving}
              </Button>
              <Button onClick={() => {}}>{json.dialog.saveAndExit}</Button>
            </DialogFooter>
          </DialogOverlay>
        </Dialog>
      </div>
    </div>
  );
}
