import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sprout } from "lucide-react";
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
    <section className="relative px-4 pt-14 pb-12 md:pt-20 md:pb-16 overflow-hidden">
      {/* Background decorative glow element */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-25 dark:opacity-15 pointer-events-none">
        <div className="w-[500px] h-[300px] bg-gradient-to-tr from-primary/20 to-emerald-500/20 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto max-w-2xl text-center space-y-6">
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-sm mx-auto">
          <Sprout className="w-3.5 h-3.5" />
          <span>منصة التخصصات والخدمات الزراعية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.2]">
          {firstName ? (
            <>أهلاً بيك تاني، <span className="text-primary">{firstName}</span></>
          ) : (
            "كل حاجة عن الزراعة، في مكان واحد"
          )}
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
          كورسات ومحتوى عملي في التخصصات الزراعية، ومتجر لأدوات ومستلزمات شغلك.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-card/80 backdrop-blur-sm border border-border/80 rounded-xl p-2 max-w-lg mx-auto shadow-sm hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
        >
          <Search className="w-4 h-4 text-muted-foreground mx-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كورس أو تخصص زراعي..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-1.5 min-w-0"
          />
          <Button type="submit" size="sm" className="rounded-lg px-4 shadow-sm">
            بحث
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/courses">
            <Button size="lg" className="rounded-xl shadow-sm">
              شوف الكورسات
            </Button>
          </Link>
          {!user && (
            <Link to="/register">
              <Button variant="outline" size="lg" className="rounded-xl border-border/80 hover:bg-muted/50">
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
