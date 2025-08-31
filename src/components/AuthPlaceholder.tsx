import { useState } from "react";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export function AuthPlaceholder({ onLogin, onRegister }: Props) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        await onRegister(name, email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-subtle)" }}
    >
      <Card className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">SecurePass</h1>
          <p className="text-muted-foreground">Your personal password manager</p>
        </div>

        <div className="space-y-4">
          {/* Show name input only when registering */}
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className="input w-full rounded-md border border-gray-300 px-4 py-2
                text-gray-900 placeholder:text-gray-500
                dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-colors duration-200 shadow-sm"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="input w-full rounded-md border border-gray-300 px-4 py-2
              text-gray-900 placeholder:text-gray-500
              dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-colors duration-200 shadow-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="input w-full rounded-md border border-gray-300 px-4 py-2
              text-gray-900 placeholder:text-gray-500
              dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-colors duration-200 shadow-sm"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            className="w-full button-glow rounded-md"
            size="lg"
            style={{ background: "var(--gradient-primary)" }}
            onClick={submitHandler}
            disabled={
              loading ||
              !email ||
              !password ||
              (isRegistering && !name.trim()) // Require name only when registering
            }
          >
            {isRegistering ? (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Register
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-md"
            size="lg"
            onClick={() => {
              setError(null);
              setIsRegistering((v) => !v);
            }}
            disabled={loading}
          >
            {isRegistering ? "Have an account? Sign In" : "Create Account"}
          </Button>
        </div>

        {!isRegistering && (
          <div className="text-center text-sm text-muted-foreground">
            {/* <p>Authentication is powered by your Node backend JWT</p> */}
          </div>
        )}
      </Card>
    </div>
  );
}
