import Link from "next/link";
import {
  GraduationCap,
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
  WhatsappLogo,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

const footerLinks = {
  consultancy: [
    { label: "About Us", href: "/about" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Latest Blog", href: "/blog" },
    { label: "Contact & Offices", href: "/contact" },
  ],
  services: [
    { label: "Study Abroad Programs", href: "/study-abroad" },
    { label: "Study in India Programs", href: "/study-in-india" },
    { label: "Test Preparation", href: "/test-preparation" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Settings", href: "/cookie-settings" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-subtle-gray/30 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap size={28} className="text-primary" weight="fill" />
              <span className="font-display font-bold text-xl tracking-tight text-primary">
                ANNEX
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[30ch]">
              Annex Education Consultancy provides international and domestic placement services, empowering students to secure admission at top global institutions.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"
              >
                <FacebookLogo size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"
              >
                <InstagramLogo size={18} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"
              >
                <YoutubeLogo size={18} />
              </a>

              <a
                href="https://wa.me/977123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"
              >
                <WhatsappLogo size={18} />
              </a>
              <a
                href="https://www.google.com/maps/place/Annex+Consultancy/@22.620505,88.3496737,17z/data=!3m1!4b1!4m6!3m5!1s0x39f89d0068f61edf:0xf74330027ddf3430!8m2!3d22.6205001!4d88.3522486!16s%2Fg%2F11x6t46f2h?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"
                aria-label="Google Maps"
              >
                <MapPin size={18} />
              </a>
            </div>
          </div>

          {/* Consultancy links */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
              Consultancy
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.consultancy.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Nepal Office
              </h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Kathmandu Head Office<br />
                New Baneshwor, Kathmandu, Nepal<br />
                Phone: +977-1-4780516<br />
                Email: info@annexconsultant.com
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                India Office
              </h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                99/1/2, Girish Ghosh Rd<br />
                Belur Math, Ghusuri<br />
                Howrah, West Bengal 711202<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-hairline/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-semibold">
            &copy; {currentYear} Annex Education Consultancy. All rights reserved.
          </p>

          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
