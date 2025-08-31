import { useState, useEffect } from "react";
import { RefreshCw, Copy, Check, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const products = [
  { value: "gmail", label: "Gmail", icon: "📧" },
  { value: "google", label: "Google", icon: "🟢" },
  { value: "facebook", label: "Facebook", icon: "👤" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "twitter", label: "Twitter/X", icon: "🐦" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "amazon", label: "Amazon", icon: "🛒" },
  { value: "netflix", label: "Netflix", icon: "🎬" },
  { value: "spotify", label: "Spotify", icon: "🎵" },
  { value: "github", label: "GitHub", icon: "💻" },
  { value: "apple", label: "Apple", icon: "🍎" },
  { value: "microsoft", label: "Microsoft", icon: "🪟" },
  { value: "dropbox", label: "Dropbox", icon: "📁" },
  { value: "slack", label: "Slack", icon: "💬" },
  { value: "paypal", label: "PayPal", icon: "💰" },
  { value: "pinterest", label: "Pinterest", icon: "📌" },
  { value: "snapchat", label: "Snapchat", icon: "👻" },
  { value: "tiktok", label: "TikTok", icon: "🎶" },
  { value: "uber", label: "Uber", icon: "🚗" },
  { value: "airbnb", label: "Airbnb", icon: "🏠" },
  { value: "ebay", label: "eBay", icon: "🛍️" },
  { value: "reddit", label: "Reddit", icon: "👽" },
  { value: "tumblr", label: "Tumblr", icon: "🌀" },
  { value: "zoom", label: "Zoom", icon: "🎥" },
  { value: "discord", label: "Discord", icon: "🎮" },
  { value: "twitch", label: "Twitch", icon: "🎮" },
  { value: "wordpress", label: "WordPress", icon: "🌐" },
  { value: "whatsapp", label: "WhatsApp", icon: "📱" },
  { value: "steam", label: "Steam", icon: "🎮" },
  { value: "adobe", label: "Adobe", icon: "🎨" },
  { value: "stackoverflow", label: "Stack Overflow", icon: "🖥️" },
  { value: "stripe", label: "Stripe", icon: "💳" },
  { value: "paytm", label: "Paytm", icon: "💸" },
  { value: "googlepay", label: "Google Pay", icon: "💸" },
  { value: "phonepe", label: "PhonePe", icon: "📱" },
  { value: "zomato", label: "Zomato", icon: "🍽️" },
  { value: "swiggy", label: "Swiggy", icon: "🍱" },
  { value: "flipkart", label: "Flipkart", icon: "🛒" },
  { value: "ola", label: "Ola", icon: "🚖" },
  { value: "hotstar", label: "Hotstar", icon: "📺" },
  { value: "venmo", label: "Venmo", icon: "💸" },
  { value: "chase", label: "Chase", icon: "🏦" },
  { value: "bankofamerica", label: "Bank of America", icon: "🏦" },
  { value: "wellsfargo", label: "Wells Fargo", icon: "🏦" },
  { value: "citibank", label: "Citibank", icon: "🏦" },
  { value: "icicibank", label: "ICICI Bank", icon: "🏦" },
  { value: "ubibank", label: "UBI Bank", icon: "🏦" },
  { value: "sbi", label: "SBI", icon: "🏦" },
  { value: "bankofbaroda", label: "Bank of Baroda", icon: "🏦" },
  { value: "indmoney", label: "IND Money", icon: "💰" },
  { value: "cred", label: "Cred", icon: "💳" },
  { value: "groww", label: "Groww", icon: "📈" },
  { value: "other", label: "Other", icon: "🔐" },
];

// Word lists for human-readable passwords
const adjectives = ["Swift", "Bright", "Cosmic", "Electric", "Crystal", "Golden", "Mystic", "Solar", "Lunar", "Quantum"];
const nouns = ["Phoenix", "Dragon", "Thunder", "Mountain", "Ocean", "Forest", "Galaxy", "Nebula", "Comet", "Aurora"];
const separators = [".", "-", "_", "@", "#"];

interface GeneratedPassword {
  password: string;
  product: string;
  userId: string;
  length: number;
  createdAt: Date;
}

export function PasswordGenerator({ onSave }: { onSave?: (password: GeneratedPassword) => void }) {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [product, setProduct] = useState("");
  const [userId, setUserId] = useState("");
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const len = length[0];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const sep = separators[Math.floor(Math.random() * separators.length)];
    const numbers = Math.floor(Math.random() * 9000) + 1000;
    const specialChars = "!@#$%^&*";
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    
    let basePassword = `${adj}${sep}${noun}${numbers}${specialChar}`;
    
    // Add random characters if needed to reach desired length
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    while (basePassword.length < len) {
      basePassword += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Trim if too long
    if (basePassword.length > len) {
      basePassword = basePassword.substring(0, len);
    }
    
    setPassword(basePassword);
    setShowConfirm(false);
    evaluateStrength(basePassword);
  };

  const evaluateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    setStrength(Math.min(score, 5));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const handleSave = () => {
    if (!product || !userId) {
      toast({
        title: "Missing Information",
        description: "Please select a product and enter a user ID",
        variant: "destructive",
      });
      return;
    }

    const passwordData: GeneratedPassword = {
      password,
      product,
      userId,
      length: length[0],
      createdAt: new Date(),
    };

    onSave?.(passwordData);
    toast({
      title: "Password Saved!",
      description: "Your password has been securely stored",
    });

    // Reset form
    setPassword("");
    setProduct("");
    setUserId("");
    setShowConfirm(false);
  };

  const handleGenerateClick = () => {
    if (!product || !userId) {
      toast({
        title: "Missing Information",
        description: "Please select a product and enter a user ID first",
        variant: "destructive",
      });
      return;
    }
    generatePassword();
    setShowConfirm(true);
  };

  useEffect(() => {
    if (password) {
      evaluateStrength(password);
    }
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-destructive";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    if (strength <= 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Password Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="product">Product/Service</Label>
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger className="input-focus">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {products.map((prod) => (
                <SelectItem key={prod.value} value={prod.value}>
                  <span className="flex items-center gap-2">
                    <span>{prod.icon}</span>
                    <span>{prod.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="userId">User ID / Email</Label>
          <Input
            id="userId"
            type="email"
            placeholder="user@example.com"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-focus"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="length">Password Length</Label>
            <span className="text-sm text-muted-foreground">{length[0]} characters</span>
          </div>
          <Slider
            id="length"
            min={8}
            max={32}
            step={1}
            value={length}
            onValueChange={setLength}
            className="py-4"
          />
        </div>

        {password && (
          <div className="space-y-3">
            <div className="relative">
              <Input
                value={password}
                readOnly
                className="pr-12 font-mono input-focus"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Strength:</span>
                <span className={cn(
                  "font-medium",
                  strength > 3 ? "text-green-500" : strength > 2 ? "text-yellow-500" : "text-destructive"
                )}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-300", getStrengthColor())}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleGenerateClick}
            className="flex-1 button-glow"
            style={{
              background: "var(--gradient-primary)",
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {password ? "Regenerate" : "Generate"} Password
          </Button>
        </div>

        {showConfirm && password && (
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Confirm Password</p>
                <p className="text-sm text-muted-foreground">
                  Are you satisfied with this password?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="button-glow"
                style={{
                  background: "var(--gradient-primary)",
                }}
              >
                Save Password
              </Button>
              <Button
                onClick={generatePassword}
                size="sm"
                variant="outline"
              >
                Recreate
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}