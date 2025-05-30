
import type { EducationalContent } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Image import removed
import { ArrowRight } from "lucide-react";

type EducationalCardProps = {
  content: EducationalContent;
};

export function EducationalCard({ content }: EducationalCardProps) {
  const Icon = content.icon;
  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Image section removed */}
      <CardHeader className="flex-grow pb-2 pt-6"> {/* Adjusted padding since image is removed */}
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold mt-1 group-hover:text-primary line-clamp-2">{content.title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{content.summary}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button asChild variant="link" className="p-0 text-primary group-hover:underline">
          <Link href={`/citizen/learn/${content.id}`}>
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
