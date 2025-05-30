
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { EDUCATIONAL_CONTENT } from '@/lib/constants';
import type { EducationalContent as EducationalContentType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EducationalContentPage() {
  const params = useParams();
  const contentId = params.contentId as string;
  const contentItem = EDUCATIONAL_CONTENT.find((item) => item.id === contentId);

  if (!contentItem) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold">Content Not Found</h1>
        <p className="text-muted-foreground">The educational material you are looking for does not exist.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/citizen/learn">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Learn Page
          </Link>
        </Button>
      </div>
    );
  }

  const Icon = contentItem.icon;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Link href="/citizen/learn" className="inline-flex items-center text-sm text-primary hover:underline mb-2">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to All Educational Content
      </Link>

      <Card className="shadow-xl overflow-hidden">
        {contentItem.imageUrl && (
          <div className="relative w-full h-60 md:h-80">
            <Image 
              src={contentItem.imageUrl} 
              alt={contentItem.title} 
              fill
              style={{objectFit: 'cover'}}
              data-ai-hint={contentItem.dataAiHint || "education detail"}
              priority // Prioritize loading for LCP
            />
          </div>
        )}
        <CardHeader className="border-b">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{contentItem.title}</CardTitle>
          </div>
          {contentItem.summary && (
            <CardDescription className="text-md text-muted-foreground italic">
              {contentItem.summary}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="py-6">
          {contentItem.fullContent ? (
            // Using dangerouslySetInnerHTML for simple HTML from constants for now. 
            // For user-generated content or complex HTML, use a proper Markdown parser/renderer.
            <article 
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert" 
              dangerouslySetInnerHTML={{ __html: contentItem.fullContent.replace(/\n/g, '<br />') }} 
            />
          ) : (
            <p className="text-muted-foreground">Detailed content coming soon for this topic.</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button asChild variant="default" size="lg">
          <Link href="/citizen/learn">
            Explore More Topics
          </Link>
        </Button>
      </div>
    </div>
  );
}
