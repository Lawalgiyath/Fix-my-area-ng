import type { EducationalContent } from "@/types";
import Link from "next/link"; // Assuming we might link to a detailed page later
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type EducationalCardProps = {
  content: EducationalContent;
};

export function EducationalCard({ content }: EducationalCardProps) {
  const Icon = content.icon;
  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {content.imageUrl && (
        <div className="relative h-48 w-full">
          <Image 
            src={content.imageUrl} 
            alt={content.title} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={content.dataAiHint || "education learning"}
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold mt-1 group-hover:text-primary">{content.title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{content.summary}</CardDescription>
      </CardHeader>
      <CardFooter>
        {/* Placeholder for a "Read More" link if detailed pages are added */}
        <Button variant="link" className="p-0 text-primary group-hover:underline">
          Learn More <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
