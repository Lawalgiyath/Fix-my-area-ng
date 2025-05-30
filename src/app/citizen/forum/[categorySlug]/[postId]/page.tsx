import { FORUM_CATEGORIES, MOCK_THREADS } from "@/lib/constants";
import type { ForumThread } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, UserCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function ForumPostPage({ params }: { params: { categorySlug: string, postId: string } }) {
  const category = FORUM_CATEGORIES.find(c => c.slug === params.categorySlug);
  const thread: ForumThread | undefined = (MOCK_THREADS[params.categorySlug] || []).find(t => t.id === params.postId);

  if (!category || !thread) {
    return <div className="text-center py-10">Thread not found.</div>;
  }

  const mockComments = [
    { id: 'c1', author: 'User123', avatarInitial: 'U', content: 'This is a great point! I totally agree.', date: '2 hours ago' },
    { id: 'c2', author: thread.author, avatarInitial: thread.author.charAt(0), content: 'Thanks for the feedback! Glad you found it useful.', date: '1 hour ago' },
    { id: 'c3', author: 'AnotherUser', avatarInitial: 'A', content: 'I have a slightly different perspective on this...', date: '30 minutes ago' },
  ];


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
                    <AvatarImage src={`https://placehold.co/40x40.png?text=${thread.author.charAt(0)}`} alt={thread.author} data-ai-hint="user avatar"/>
                    <AvatarFallback>{thread.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{thread.author}</p>
                    <p className="text-xs text-muted-foreground">Original Poster</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-lg">This is the main content of the forum post. It would typically be longer and more detailed. For now, this is a placeholder to illustrate the structure of a post page.</p>
          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Posted on: {new Date().toLocaleDateString()} (Mock Date)
        </CardFooter>
      </Card>
      
      <h2 className="text-2xl font-semibold text-primary border-b pb-2">Replies ({mockComments.length})</h2>
      <div className="space-y-4">
        {mockComments.map(comment => (
          <Card key={comment.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://placehold.co/40x40.png?text=${comment.avatarInitial}`} alt={comment.author} data-ai-hint="user avatar"/>
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
            <Button className="bg-primary hover:bg-primary/90">
                <MessageSquare className="mr-2 h-4 w-4" /> Post Reply
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
