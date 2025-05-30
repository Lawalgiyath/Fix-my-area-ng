import { ForumCategoryCard } from "@/components/forum/category-card";
import { FORUM_CATEGORIES } from "@/lib/constants";

export default function ForumPage() {
  return (
    <div className="space-y-6">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-primary">Community Forum</h1>
        <p className="text-muted-foreground mt-1">
          Discuss local issues, share ideas, and collaborate with fellow citizens.
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FORUM_CATEGORIES.map((category) => (
          <ForumCategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
