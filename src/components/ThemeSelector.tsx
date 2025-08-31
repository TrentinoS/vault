import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { name: "Ocean", value: "ocean", colors: "bg-gradient-to-r from-blue-500 to-purple-500" },
  { name: "Emerald", value: "emerald", colors: "bg-gradient-to-r from-emerald-500 to-teal-500" },
  { name: "Sunset", value: "sunset", colors: "bg-gradient-to-r from-orange-500 to-pink-500" },
  { name: "Midnight", value: "midnight", colors: "bg-gradient-to-r from-indigo-600 to-purple-600" },
];

interface ThemeSelectorProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export function ThemeSelector({ currentTheme, setTheme }: ThemeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="glass-card">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-card">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentTheme === theme.value ? "bg-primary/10" : ""
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${theme.colors}`} />
            <span>{theme.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
