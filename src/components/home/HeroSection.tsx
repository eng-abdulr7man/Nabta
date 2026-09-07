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
    <section className="px-4 pt-12 pb-10 md:pt-16 md:pb-14">
      <div className="container mx-auto max-w-2xl text-center space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-snug">
          {firstName ? <>أهلاً بيك تاني، {firstName}</> : "كل حاجة عن الزراعة، في مكان واحد"}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          كورسات ومحتوى عملي في التخصصات الزراعية، ومتجر لأدوات ومستلزمات شغلك.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-card border border-border rounded-lg p-1.5 max-w-lg mx-auto focus-within:border-primary transition-colors"
        >
          <Search className="w-4 h-4 text-muted-foreground mx-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كورس أو تخصص..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-1.5 min-w-0"
          />
          <Button type="submit" size="sm">بحث</Button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link to="/courses">
            <Button>شوف الكورسات</Button>
          </Link>
          {!user && (
            <Link to="/register">
              <Button variant="outline">اعمل حساب جديد</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
