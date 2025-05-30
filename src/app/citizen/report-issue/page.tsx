
import { ReportIssueForm } from "@/components/citizen/report-issue-form";
import { MultilingualGuide } from "@/components/help/multilingual-guide";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Languages } from "lucide-react";

export default function ReportIssuePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <ReportIssueForm />

      <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
        <AccordionItem value="multilingual-guide">
          <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
            <div className="flex items-center">
              <Languages className="mr-2 h-5 w-5" />
              Need Help with Local Language Phrasing? (Expand)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* The MultilingualGuide component itself contains a Card, so we don't need to wrap it again here. */}
            {/* We might want to adjust styling in MultilingualGuide if it looks too nested. */}
            <MultilingualGuide />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
