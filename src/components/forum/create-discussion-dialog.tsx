
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { ForumThread, StoredForumThreads, UserProfile } from '@/types';
import { MOCK_THREADS, LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { Loader2, MessageSquarePlus } from 'lucide-react';

const createDiscussionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title cannot exceed 100 characters."}),
  initialPost: z.string().min(10, { message: "Your post must be at least 10 characters." }).max(2000, { message: "Post cannot exceed 2000 characters."}),
});

type CreateDiscussionFormValues = z.infer<typeof createDiscussionSchema>;

type CreateDiscussionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categorySlug: string;
  onDiscussionCreated: (newThread: ForumThread) => void;
};

export function CreateDiscussionDialog({
  isOpen,
  onOpenChange,
  categorySlug,
  onDiscussionCreated,
}: CreateDiscussionDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserMoniker, setCurrentUserMoniker] = useState<string>('Citizen');
  const [currentUserFirstName, setCurrentUserFirstName] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        try {
          const parsedUser: Pick<UserProfile, 'moniker' | 'firstName'> = JSON.parse(storedUser);
          setCurrentUserMoniker(parsedUser.moniker || parsedUser.firstName || 'Citizen');
          setCurrentUserFirstName(parsedUser.firstName);
        } catch (e) {
          console.error("Failed to parse user for CreateDiscussionDialog", e);
          setCurrentUserMoniker('Citizen');
          setCurrentUserFirstName(undefined);
        }
      } else {
        setCurrentUserMoniker('Citizen');
        setCurrentUserFirstName(undefined);
      }
    }
  }, [isOpen]);

  const form = useForm<CreateDiscussionFormValues>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: '',
      initialPost: '',
    },
  });

  const handleSubmit = async (data: CreateDiscussionFormValues) => {
    setIsLoading(true);
    try {
      const newThreadId = `${categorySlug}-${Date.now()}`; // Simple unique ID generation
      const newThread: ForumThread = {
        id: newThreadId,
        title: data.title,
        author: currentUserMoniker,
        authorFirstName: currentUserFirstName,
        categorySlug: categorySlug,
        contentPreview: data.initialPost.substring(0, 100) + (data.initialPost.length > 100 ? '...' : ''),
        repliesCount: 0,
        lastReply: 'Just now', // Placeholder
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      if (typeof window !== 'undefined') {
        const storedThreadsRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.FORUM_THREADS);
        let allThreads: StoredForumThreads;
        try {
            allThreads = storedThreadsRaw ? JSON.parse(storedThreadsRaw) : MOCK_THREADS;
        } catch(e) {
            console.error("Error parsing stored threads, defaulting to MOCK_THREADS", e);
            allThreads = MOCK_THREADS;
        }
        
        if (!allThreads[categorySlug]) {
          allThreads[categorySlug] = [];
        }
        allThreads[categorySlug] = [newThread, ...allThreads[categorySlug]];
        localStorage.setItem(LOCAL_STORAGE_KEYS.FORUM_THREADS, JSON.stringify(allThreads));
      }

      onDiscussionCreated(newThread);
      toast({
        title: 'Discussion Started!',
        description: `"${data.title}" has been created.`,
        className: "bg-green-50 border-green-200 text-green-700"
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: 'Error',
        description: 'Could not start discussion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquarePlus className="mr-2 h-6 w-6 text-primary" />
            Start a New Discussion
          </DialogTitle>
          <DialogDescription>
            Share your thoughts or questions with the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discussion Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ideas for improving local park" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialPost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Initial Post</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Clearly state your topic, question, or idea..."
                      className="min-h-[150px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Discussion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

