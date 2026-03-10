import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // لما مسار الصفحة يتغير، اطلع لأعلى نقطة (0, 0)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // يفضل instant عشان ميعملش أنيميشن سكرول طويل ويزعج المستخدم
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
