
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface Language {
  code: string;
  name: string;
  region: string;
  flag: string;
}

const languages: Language[] = [
  { code: "EN", name: "English", region: "US", flag: "🇺🇸" },
  { code: "FR", name: "Français", region: "CA", flag: "🇨🇦" },
  { code: "ES", name: "Español", region: "ES", flag: "🇪🇸" },
  { code: "DE", name: "Deutsch", region: "DE", flag: "🇩🇪" },
];

const LanguageToggle = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selected-language');
    if (savedLanguage) {
      const found = languages.find(lang => `${lang.code}/${lang.region}` === savedLanguage);
      if (found) {
        setSelectedLanguage(found);
      }
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selected-language', `${language.code}/${language.region}`);
    // Here you would typically trigger a language change in your i18n system
    console.log(`Language changed to: ${language.code}/${language.region}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-auto px-2 gap-1">
          <Globe className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {selectedLanguage.flag} {selectedLanguage.code}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={`${language.code}-${language.region}`}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span className="text-sm">{language.name}</span>
              <span className="text-xs text-muted-foreground">({language.region})</span>
            </div>
            {selectedLanguage.code === language.code && selectedLanguage.region === language.region && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
