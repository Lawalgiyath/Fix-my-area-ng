import type { ForumCategory } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type ForumCategoryCardProps = {
  category: ForumCategory;
};

export function ForumCategoryCard({ category }: ForumCategoryCardProps) {
  const Icon = category.icon;
  return (
    <Link href={`/citizen/forum/${category.slug}`} passHref>
      <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-primary cursor-pointer group">
        <CardHeader className="flex-grow">
          <div className="flex items-center mb-3">
            <Icon className="h-10 w-10 text-primary mr-4" />
            <CardTitle className="text-xl font-semibold group-hover:text-primary">{category.name}</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3">{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="link" className="p-0 text-primary group-hover:underline">
              View Discussions <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
