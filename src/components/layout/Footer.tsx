import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send } from "lucide-react";

const exploreLinks = [
  { label: "تصفح الكورسات", path: "/courses" },
  { label: "سوق نبتة", path: "/marketplace" },
  { label: "التخصصات الزراعية", path: "/specializations" },
  { label: "المقالات والأخبار", path: "/articles" },
];

const helpLinks = [
  { label: "من إحنا", path: "/about" },
  { label: "الأسئلة الشائعة", path: "/faq" },
  { label: "سياسة الخصوصية", path: "/privacy" },
  { label: "شروط الاستخدام", path: "/terms" },
];

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/share/18Dbz2ppwn/" },
  { icon: Send, href: "https://t.me/eng_abdulr7man" },
  { icon: Instagram, href: "https://www.instagram.com/eng_abdulr7man/" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/eng_abdulr7man" },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto pt-12 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* البراند */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl text-foreground">نبْتَة</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              منصة عربية للتعليم الزراعي — كورسات ومحتوى عملي وسوق لبيع وشراء المستلزمات الزراعية.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* استكشف */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">استكشف</h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* المساعدة */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">المساعدة</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>wwwbgaro59@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span dir="ltr">0101 971 5490</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>المنصورة - مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} نبْتَة. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-muted-foreground">
            تطوير{" "}
            <a
              href="https://www.instagram.com/eng_abdulr7man/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              3bdulr7man
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
