
"use client"; 
import { use } from 'react'; // Added import
import { FORUM_CATEGORIES, MOCK_THREADS } from "@/lib/constants";
import type { ForumThread } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; 

export default function ForumPostPage({ params: paramsProp }: { params: { categorySlug: string, postId: string } }) {
  const params = use(paramsProp); // Unwrap params
  const category = FORUM_CATEGORIES.find(c => c.slug === params.categorySlug);
  const thread: ForumThread | undefined = (MOCK_THREADS[params.categorySlug] || []).find(t => t.id === params.postId);
  const { toast } = useToast();

  const mockComments: { id: string, author: string, avatarInitial: string, content: string, date: string }[] = [];

  const handlePostReply = () => {
    toast({
      title: "Demo Action",
      description: "Posting replies is not fully implemented in this prototype.",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-700"
    });
  };

  if (!category) { 
    return <div className="text-center py-10">Category not found.</div>;
  }

  if (!thread) {
    return <div className="text-center py-10">Thread not found or no threads available in this category.</div>;
  }


  return (
    <div className="space-y-6">
      <header>
        <Link href={`/citizen/forum/${category.slug}`} className="inline-flex items-center text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {category.name}
        </Link>
        <h1 className="text-3xl font-bold text-primary">{thread.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Started by <span className="font-medium">{thread.author}</span> in <span className="font-medium">{category.name}</span>
        </p>
      </header>

      <Card className="shadow-md">
        <CardHeader className="border-b">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>{thread.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{thread.author}</p>
                    <p className="text-xs text-muted-foreground">Original Poster</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-lg">This is where the main content of the forum post would be displayed. In a real application, this content would be fetched from a database.</p>
          <p className="mt-4">Further details and discussions related to the topic would follow here.</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Posted on: {new Date().toLocaleDateString()} (Mock Date, as content is static)
        </CardFooter>
      </Card>
      
      <h2 className="text-2xl font-semibold text-primary border-b pb-2">Replies ({mockComments.length})</h2>
      <div className="space-y-4">
        {mockComments.length === 0 && (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No replies yet for this discussion.
            </CardContent>
          </Card>
        )}
        {mockComments.map(comment => (
          <Card key={comment.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.avatarInitial.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium text-sm">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl">Leave a Reply</CardTitle>
        </CardHeader>
        <CardContent>
            <Textarea placeholder="Write your comment here..." className="min-h-[100px]" />
        </CardContent>
        <CardFooter>
            <Button className="bg-primary hover:bg-primary/90" onClick={handlePostReply}>
                <MessageSquare className="mr-2 h-4 w-4" /> Post Reply
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
