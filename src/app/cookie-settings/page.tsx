"use client";

import * as React from "react";
import { Sparkle, Cookie, Check, ShieldCheck, X } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CookieSettings() {
  const [preferences, setPreferences] = React.useState({
    essential: true,
    functional: true,
    analytics: false,
  });

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  // Load preferences from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("annex_cookies_preferences");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          essential: true, // Always true
          functional: parsed.functional ?? true,
          analytics: parsed.analytics ?? false,
        });
      }
    } catch (e) {
      console.error("Failed to load cookie preferences", e);
    }
    setIsLoaded(true);
  }, []);

  const handleToggle = (key: "functional" | "analytics") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("annex_cookies_preferences", JSON.stringify(preferences));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } catch (e) {
      console.error("Failed to save cookie preferences", e);
    }
  };

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          
          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-8 right-8 z-50 bg-primary text-white border border-hairline/20 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in-up">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gold">
                <Check size={14} weight="bold" />
              </div>
              <div className="text-xs font-semibold">
                Cookie preferences saved successfully!
              </div>
              <button 
                onClick={() => setShowToast(false)} 
                className="text-white/60 hover:text-white ml-2 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              User Control
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Cookie Settings
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[60ch]">
              We use cookies to improve your experience on our website. You can configure your preferences below to control how we store and access data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Preferences Form Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {isLoaded ? (
                <>
                  {/* Essential Cookies */}
                  <Card className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Cookie size={20} className="text-primary" weight="fill" />
                          <CardTitle className="text-base">Essential Cookies</CardTitle>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            Required
                          </span>
                        </div>
                        <CardDescription className="text-slate-500 text-xs md:text-sm">
                          These cookies are necessary for the website to function securely and cannot be disabled. They help establish encrypted sessions, support user navigation, and keep our query forms functioning.
                        </CardDescription>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <div className="w-12 h-6 rounded-full bg-primary/20 p-1 cursor-not-allowed opacity-60 relative">
                          <div className="w-4 h-4 rounded-full bg-primary absolute right-1 top-1" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Functional Cookies */}
                  <Card className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Cookie size={20} className="text-primary" weight="fill" />
                          <CardTitle className="text-base">Functional Cookies</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 text-xs md:text-sm">
                          These cookies allow the site to remember choices you make, such as your preferred study destination or previous test preparation course searches, to deliver a personalized consultation journey.
                        </CardDescription>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleToggle("functional")}
                          className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer relative ${
                            preferences.functional ? "bg-primary" : "bg-slate-200"
                          }`}
                          aria-pressed={preferences.functional}
                          aria-label="Toggle Functional Cookies"
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute top-1 ${
                              preferences.functional ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Analytics Cookies */}
                  <Card className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Cookie size={20} className="text-primary" weight="fill" />
                          <CardTitle className="text-base">Analytics Cookies</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 text-xs md:text-sm">
                          We gather aggregated, anonymous usage patterns using analytics platforms to track page views, bounce rates, and form usage. Enabling this helps us optimize our layout design and services.
                        </CardDescription>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleToggle("analytics")}
                          className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer relative ${
                            preferences.analytics ? "bg-primary" : "bg-slate-200"
                          }`}
                          aria-pressed={preferences.analytics}
                          aria-label="Toggle Analytics Cookies"
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute top-1 ${
                              preferences.analytics ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-start mt-4">
                    <Button onClick={handleSave} variant="primary" className="w-full md:w-auto">
                      Save Settings
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 font-mono-data text-xs">
                  Loading settings...
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={20} className="text-gold" weight="fill" />
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400">Compliance & Privacy</CardTitle>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Annex respects user privacy laws, including cookie consent regulations. Standard essential cookies are generated automatically to retain site state.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Preferences updated here are stored locally in your browser and applied immediately to current browsing sessions.
                </p>
              </Card>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
