import { EducationalCard } from "@/components/learn/educational-card";
import { EDUCATIONAL_CONTENT } from "@/lib/constants";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-primary">Learn & Get Informed</h1>
        <p className="text-muted-foreground mt-1">
          Knowledge is power. Understand your rights, responsibilities, and how our community works.
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EDUCATIONAL_CONTENT.map((content) => (
          <EducationalCard key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
}
