'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import AddCircle from '@mui/icons-material/AddCircle';
import {FormLabel} from '@mui/material';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {addEvent} from '~/app/actions/event';
import Textarea from '~/shared/components/legacy/textarea';
import {Button} from '~/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/shared/components/ui/select';
import {errorToast, successToast} from '~/shared/components/ui/toast';
import {QUERY_KEY} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import type {IEventDto} from '~/shared/types';
import type {ICreateStudentEventDto} from '../types';
import {StudentEventDataSchema} from '../validations';

interface HeaderProps {
  eventOptions: IEventDto[];
  studentCode: string;
  gradeName: string;
  username: string;
}

export type NewEventFormData = z.infer<typeof StudentEventDataSchema>;

export default function NewEventForm({
  eventOptions,
  gradeName,
  studentCode,
  username,
}: HeaderProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<NewEventFormData>({
    resolver: zodResolver(StudentEventDataSchema),
  });

  const {mutate, isPending: isSubmitting} = useMutation({
    mutationFn: async (data: NewEventFormData) => {
      const dto: ICreateStudentEventDto = {
        data,
        studentCode,
        username,
        gradeName,
      };
      return await addEvent(dto);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.EVENT, studentCode],
      });
      form.reset();
      successToast();
      closeForm();
    },
    onError: error => errorToast(error.message),
  });

  const closeForm = () => {
    if (!open) return;
    setOpen(false);
  };

  const onSubmit = (data: NewEventFormData) => {
    mutate(data);
  };

  return (
    <div className="w-24/25 m-auto flex items-center pb-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg hover:opacity-80">
            <AddCircle />
            <span>新規作成</span>
          </button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>新規作成</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-y-3 m-auto p-4">
              <FormField
                control={form.control}
                name="eventName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{json.event.selectEvent}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2">
                          <SelectValue placeholder={json.event.placeholder0} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="px-4">
                            {json.event.placeholder0}
                          </SelectLabel>
                          {eventOptions!?.map(option => (
                            <SelectItem key={option.id} value={option.name}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Events in school life */}
              <FormField
                control={form.control}
                name="eventsInSchoolLife"
                render={() => (
                  <FormItem>
                    <FormLabel>{json.event.question1}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={json.event.placeholder1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* My Actions */}
              <FormField
                control={form.control}
                name="myAction"
                render={() => (
                  <FormItem>
                    <FormLabel>{json.event.question2}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={json.event.placeholder2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shown power */}

              <FormField
                control={form.control}
                name="shownPower"
                render={() => (
                  <FormItem>
                    <FormLabel>{json.event.question3}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={json.event.placeholder3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Strength that has grown */}
              <FormField
                control={form.control}
                name="strengthGrown"
                render={() => (
                  <FormItem>
                    <FormLabel>{json.event.question4}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={json.event.placeholder4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* What I thought */}
              <FormField
                control={form.control}
                name="myThought"
                render={() => (
                  <FormItem>
                    <FormLabel>{json.event.question5}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={json.event.placeholder5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>送信中。。。</span>
                  </>
                ) : (
                  <span>送信</span>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
