import { Shield, LogOut, User } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  logout?: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export function Header({
  userEmail = "user@example.com",
  userName,
  logout,
  theme,
  setTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--gradient-primary)",
            }}
          >
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">SecurePass</h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSelector currentTheme={theme} setTheme={setTheme} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="glass-card">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="glass-card">
              <DropdownMenuItem disabled className="font-medium">
                {userName || userEmail}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => {
                  if (logout) logout();
                }}
              >
                <LogOut className="mr-2 w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
