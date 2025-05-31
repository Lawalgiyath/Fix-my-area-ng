
"use client"; 
import { use } from 'react';
import { useState, useEffect } from 'react';
import { FORUM_CATEGORIES, MOCK_THREADS, LOCAL_STORAGE_FORUM_THREADS_KEY } from "@/lib/constants";
import type { ForumThread, StoredForumThreads, UserProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle, UserCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CreateDiscussionDialog } from '@/components/forum/create-discussion-dialog';

export default function ForumCategoryPage({ params: paramsProp }: { params: { categorySlug: string } }) {
  const params = use(paramsProp);
  const category = FORUM_CATEGORIES.find(c => c.slug === params.categorySlug);
  
  const [displayedThreads, setDisplayedThreads] = useState<ForumThread[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentUserMoniker, setCurrentUserMoniker] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        try {
          const parsedUser: Pick<UserProfile, 'moniker' | 'firstName'> = JSON.parse(storedUser);
          setCurrentUserMoniker(parsedUser.moniker || parsedUser.firstName || 'User');
        } catch (e) {
          console.error("Failed to parse user for forum author", e);
        }
      }

      let threadsToDisplay: ForumThread[] = [];
      try {
        const storedThreadsRaw = localStorage.getItem(LOCAL_STORAGE_FORUM_THREADS_KEY);
        if (storedThreadsRaw) {
          const allStoredThreads: StoredForumThreads = JSON.parse(storedThreadsRaw);
          threadsToDisplay = allStoredThreads[params.categorySlug] || [];
        } else {
          // Initialize localStorage if empty, using MOCK_THREADS
          threadsToDisplay = MOCK_THREADS[params.categorySlug] || [];
          localStorage.setItem(LOCAL_STORAGE_FORUM_THREADS_KEY, JSON.stringify(MOCK_THREADS));
        }
      } catch (error) {
        console.error("Error loading threads from localStorage:", error);
        threadsToDisplay = MOCK_THREADS[params.categorySlug] || [];
      }
      setDisplayedThreads(threadsToDisplay.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [params.categorySlug]);


  const handleNewDiscussionCreated = (newThread: ForumThread) => {
    setDisplayedThreads(prev => [newThread, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    // The CreateDiscussionDialog already handles updating localStorage
  };

  if (!category) {
    return <div className="text-center py-10">Category not found.</div>;
  }

  const CategoryIcon = category.icon;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <CategoryIcon className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">{category.name}</h1>
            <p className="text-muted-foreground mt-1">{category.description}</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" /> Start New Discussion
        </Button>
      </header>

      {displayedThreads.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No discussions yet</h3>
            <p className="text-muted-foreground">Be the first to start a conversation in this category!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedThreads.map(thread => (
            <Card key={thread.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Link href={`/citizen/forum/${category.slug}/${thread.id}`} passHref>
                  <CardTitle className="text-lg font-semibold text-primary hover:underline cursor-pointer">{thread.title}</CardTitle>
                </Link>
                <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                  <UserCircle className="h-3 w-3"/> Started by {thread.authorFirstName ? `${thread.authorFirstName} (${thread.author})` : thread.author}
                </CardDescription>
                 <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{thread.contentPreview}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-center text-sm pt-2">
                <Badge variant="outline">{thread.repliesCount} Replies</Badge>
                <span className="text-xs text-muted-foreground">
                  Last reply: {thread.lastReply} &bull; Created: {new Date(thread.createdAt).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
       <div className="mt-8">
        <Link href="/citizen/forum" passHref>
          <Button variant="outline">
            &larr; Back to All Categories
          </Button>
        </Link>
      </div>
      <CreateDiscussionDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categorySlug={category.slug}
        onDiscussionCreated={handleNewDiscussionCreated}
      />
    </div>
  );
}
