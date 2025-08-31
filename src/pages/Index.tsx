import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { PasswordVault } from "@/components/PasswordVault";
import { AuthPlaceholder } from "@/components/AuthPlaceholder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const THEME_STORAGE_KEY = "theme";

const Index = () => {
  const { isAuthenticated, user, login, register, logout, loading } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "ocean");
  const { toast } = useToast();

  // Apply theme in DOM and persist on change
  useEffect(() => {
    if (theme === "ocean") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      api("/passwords")
        .then((passwordsFromApi) => {
          const mappedPasswords = passwordsFromApi
            .map((pwd: any) => ({
              id:
                pwd._id ??
                pwd.id ??
                `${pwd.product}-${pwd.userId}-${pwd.createdAt}`,
              product: pwd.product,
              userId: pwd.userId,
              password: pwd.password,
              createdAt: pwd.createdAt,
            }))
            .filter(
              (pwd, index, self) =>
                index === self.findIndex((p) => p.id === pwd.id)
            );
          setPasswords(mappedPasswords);
        })
        .catch(() => setPasswords([]));
    } else {
      setPasswords([]);
    }
  }, [isAuthenticated]);

  // Add this inside your Index component alongside handleSavePassword
  const handleDeletePassword = async (id) => {
    try {
      await api(`/passwords/${id}`, { method: "DELETE" });
      setPasswords((prev) => prev.filter((pwd) => pwd.id !== id));
      toast({ title: "Password deleted" });
    } catch {
      toast({ title: "Failed to delete password", variant: "destructive" });
    }
  };

  // Replace your existing handleSavePassword with this
  const handleSavePassword = async (passwordData) => {
    try {
      const saved = await api("/passwords", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      setPasswords((prev) => [
        {
          ...saved,
          id: saved._id || saved.id || Date.now().toString(),
        },
        ...prev.filter(
          (pwd) => !(pwd.product === saved.product && pwd.userId === saved.userId)
        ),
      ]);
      toast({ title: "Password saved!" });
    } catch {
      toast({ title: "Failed to save password", variant: "destructive" });
    }
  };


  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <AuthPlaceholder onLogin={login} onRegister={register} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-subtle)" }}>
      {/* Pass theme management down to Header */}
      <Header userEmail={user?.email || ""} userName={user?.name || ""} logout={logout} theme={theme} setTheme={setTheme} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Card className="glass-card p-6 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--gradient-accent)" }}>
                <Info className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Welcome to SecurePass</h2>
                <p className="text-sm text-muted-foreground">
                  Generate strong, human-readable passwords for all your accounts.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto glass-card">
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
            >
              <Shield className="mr-2 h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger
              value="vault"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
            >
              <Key className="mr-2 h-4 w-4" />
              Vault
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PasswordGenerator onSave={handleSavePassword} />

              <div className="glass-card rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold gradient-text">Password Tips</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Use unique passwords for each account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Longer passwords are exponentially more secure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Mix uppercase, lowercase, numbers, and symbols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Avoid personal information in passwords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Enable two-factor authentication when available</span>
                  </li>
                </ul>

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold mb-2 text-sm">Recent Activity</h4>
                  <p className="text-xs text-muted-foreground">
                    {passwords.length > 0 
                      ? `Generated ${passwords.length} password${passwords.length === 1 ? "" : "s"} this session` 
                      : "No passwords generated yet"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vault">
            <PasswordVault passwords={passwords} onDelete={handleDeletePassword} />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Index;
