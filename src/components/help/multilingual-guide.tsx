
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MULTILINGUAL_GUIDE_LANGUAGES } from "@/lib/constants";
import type { LanguageOption } from "@/types";
import { Volume2 } from "lucide-react"; 

export function MultilingualGuide({ embedded = false }: { embedded?: boolean }) {
  const [activeLang, setActiveLang] = useState<string>(MULTILINGUAL_GUIDE_LANGUAGES[0].code);

  const cardClasses = embedded 
    ? "w-full shadow-none border-0" 
    : "w-full max-w-2xl mx-auto shadow-xl";
  
  const headerPadding = embedded ? "pt-0 px-0" : "px-6";
  const contentPadding = embedded ? "px-0" : "px-6";


  return (
    <Card className={cardClasses}>
      {!embedded && (
        <CardHeader className={headerPadding}>
          <CardTitle className="text-2xl font-bold text-primary">Multilingual Help Guide</CardTitle>
          <CardDescription>
            Common phrases in local languages to help you navigate and report issues.
            Select a language to see translations.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={`${contentPadding} ${embedded ? 'pt-0' : ''}`}>
        <Tabs value={activeLang} onValueChange={setActiveLang} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {MULTILINGUAL_GUIDE_LANGUAGES.map((lang: LanguageOption) => (
              <TabsTrigger key={lang.code} value={lang.code} className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
                {lang.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {MULTILINGUAL_GUIDE_LANGUAGES.map((lang: LanguageOption) => (
            <TabsContent key={lang.code} value={lang.code}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Useful Phrases in {lang.name}:</h3>
                <ul className="space-y-3">
                  {lang.samplePhrases.map((phraseItem) => (
                    <li key={phraseItem.title} className="p-4 border rounded-lg bg-secondary/30 shadow-sm">
                      <p className="font-medium text-foreground/90">{phraseItem.title}:</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg text-primary">{phraseItem.phrase}</p>
                        <button title="Pronounce (simulation)" className="p-1 text-muted-foreground hover:text-primary">
                           <Volume2 className="h-5 w-5"/>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
