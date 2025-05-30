import { FORUM_CATEGORIES, MOCK_THREADS } from "@/lib/constants";
import type { ForumThread } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle, UserCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ForumCategoryPage({ params }: { params: { categorySlug: string } }) {
  const category = FORUM_CATEGORIES.find(c => c.slug === params.categorySlug);
  const threads: ForumThread[] = MOCK_THREADS[params.categorySlug] || [];

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
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-5 w-5" /> Start New Discussion
        </Button>
      </header>

      {threads.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No discussions yet</h3>
            <p className="text-muted-foreground">Be the first to start a conversation in this category!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {threads.map(thread => (
            <Card key={thread.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Link href={`/citizen/forum/${category.slug}/${thread.id}`} passHref>
                  <CardTitle className="text-lg font-semibold text-primary hover:underline cursor-pointer">{thread.title}</CardTitle>
                </Link>
                <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                  <UserCircle className="h-3 w-3"/> Started by {thread.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center text-sm">
                <Badge variant="outline">{thread.repliesCount} Replies</Badge>
                <span className="text-xs text-muted-foreground">Last reply: {thread.lastReply}</span>
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
    </div>
  );
}
