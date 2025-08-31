import { useState } from "react";
import { Search, Copy, Eye, EyeOff, X, Calendar, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Password {
  id: string;
  password: string;
  product: string;
  userId: string;
  createdAt: string | Date;
}

const productIcons: Record<string, string> = {
  Gmail: "📧",
  Google: "🟢",
  Facebook: "👤",
  Instagram: "📷",
  Twitter: "🐦",
  Linkedin: "💼",
  Amazon: "🛒",
  Netflix: "🎬",
  Spotify: "🎵",
  Github: "💻",
  Apple: "🍎",
  Microsoft: "🪟",
  Dropbox: "📁",
  Slack: "💬",
  Paypal: "💰",
  Pinterest: "📌",
  Snapchat: "👻",
  Tiktok: "🎶",
  Uber: "🚗",
  Airbnb: "🏠",
  Ebay: "🛍️",
  Reddit: "👽",
  Tumblr: "🌀",
  Zoom: "🎥",
  Discord: "🎮",
  Twitch: "🎮",
  Wordpress: "🌐",
  Whatsapp: "📱",
  Steam: "🎮",
  Adobe: "🎨",
  Stackoverflow: "🖥️",
  Stripe: "💳",
  Paytm: "💸",
  GooglePay: "💸",
  PhonePe: "📱",
  Zomato: "🍽️",
  Swiggy: "🍱",
  Flipkart: "🛒",
  Ola: "🚖",
  Hotstar: "📺",
  Venmo: "💸",
  Chase: "🏦",
  BankOfAmerica: "🏦",
  WellsFargo: "🏦",
  CitiBank: "🏦",
  ICICIBank: "🏦",
  UBIBank: "🏦",
  SBI: "🏦",
  BankOfBaroda: "🏦",
  INDMoney: "💰",
  Cred: "💳",
  Groww: "📈",
  Other: "🔐",
};


export function PasswordVault({
  passwords,
  onDelete,
}: {
  passwords: Password[];
  onDelete: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const filteredPasswords = passwords.filter(
    (pwd) =>
      pwd.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pwd.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (password: string) => {
    await navigator.clipboard.writeText(password);
    toast({ title: "Copied!", description: "Password copied to clipboard" });
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
  };

  if (passwords.length === 0)
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No passwords yet</h3>
        <p className="text-muted-foreground">Generate your first password to see it here</p>
      </div>
    );

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Badge>
          {passwords.length} {passwords.length === 1 ? "Password" : "Passwords"}
        </Badge>
        <Input
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
      </div>

      <div className="space-y-4">
        {filteredPasswords.map((pwd) => (
          <div
            key={pwd.id}
            className="p-4 bg-card rounded flex flex-col"
            style={{ position: "relative" }}
          >
            <button
              aria-label="Delete password"
              onClick={() => confirmDelete(pwd.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{productIcons[pwd.product] || "🔐"}</span>
                <div>
                  <div className="font-semibold capitalize">{pwd.product}</div>
                  {/* Use muted-foreground color like before */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{pwd.userId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-4 h-4" />
                <div>{format(new Date(pwd.createdAt), "PPP")}</div>
              </div>
            </div>

            <Input
              type={showPasswords[pwd.id] ? "text" : "password"}
              value={pwd.password}
              readOnly
              className="font-mono"
            />
            <div className="mt-2 flex gap-2 justify-end">
              <Button size="icon" variant="ghost" onClick={() => togglePasswordVisibility(pwd.id)}>
                {showPasswords[pwd.id] ? <EyeOff /> : <Eye />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => copyPassword(pwd.password)}>
                <Copy />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
