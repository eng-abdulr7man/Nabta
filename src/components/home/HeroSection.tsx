import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = user && profile?.full_name ? profile.full_name.split(" ")[0] : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : "/courses");
  };

  return (
    <section className="px-4 py-16 md:py-24 border-b border-border/40 bg-card/20">
      <div className="container mx-auto max-w-3xl text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
          {firstName ? (
            <>أهلاً بيك، {firstName}</>
          ) : (
            "كل حاجة عن الزراعة، في مكان واحد"
          )}
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          كورسات ومحتوى عملي في التخصصات الزراعية، ومتجر لأدوات ومستلزمات شغلك.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-background border border-input rounded-xl p-2.5 max-w-xl mx-auto shadow-sm focus-within:border-primary transition-colors"
        >
          <Search className="w-5 h-5 text-muted-foreground mx-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كورس أو تخصص زراعي..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base py-1.5 min-w-0"
          />
          <Button type="submit" size="default" className="px-6 rounded-lg font-medium text-sm">
            بحث
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/courses">
            <Button size="default" className="px-6 py-2.5 rounded-lg font-medium">
              شوف الكورسات
            </Button>
          </Link>
          {!user && (
            <Link to="/register">
              <Button variant="outline" size="default" className="px-6 py-2.5 rounded-lg font-medium">
                اعمل حساب جديد
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
