"use client";

import * as React from "react";
import { Sparkle, Calendar, User, ArrowLeft } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogPost {
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "Russell Group Admission Guide for Fall 2026",
    category: "University Guide",
    date: "2026-06-10",
    author: "Subas Chandra Thapa",
    excerpt: "Russel Group universities in the UK represent premier research institutions. Learn about application cycles and IELTS score expectations.",
    content: "Russell Group universities (such as Oxford, Cambridge, LSE, and Imperial College) represent the peak of research and teaching excellence in the UK. Securing admissions requires a highly competitive GPA (typically 3.2+ CGPA or 70%+), structural letters of recommendation, and a focused Statement of Purpose (SoP) detailing your research goals. Intakes open primarily in September, with critical document submissions closing as early as March. Annex provides complete portfolio structuring for Russell Group entries.",
    slug: "russell-group-guide",
  },
  {
    title: "Understanding the GTE and Financial Auditing for Australia",
    category: "Visa Guide",
    date: "2026-06-05",
    author: "Sonia Regmi",
    excerpt: "Australia maintains strict financial verification parameters. Discover the documentation rules for bank history and income declarations.",
    content: "Australia's Genuine Student (GS) evaluation and financial capacity requirements mandate that international learners declare sufficient funds for tuition, living costs (A$24,505/year), and travel. Crucially, these funds must be held in certified commercial banks with verified sources of income. Annex structures detailed financial auditing to check bank balances, relationship proofs, and tax clearances match visa guidelines before submission.",
    slug: "australia-gte-guide",
  },
  {
    title: "Italy DSU Scholarship & Pre-Enrollment Timelines",
    category: "Intake Alert",
    date: "2026-05-28",
    author: "Annex Italy Desk",
    excerpt: "Italian public universities are low cost, but require strict pre-enrollment steps. Learn about timelines for DoV and DSU grants.",
    content: "Italy stands out for its public university system where tuition is highly subsidized (ranging from €800 to €3,000 yearly). Furthermore, the DSU scholarship grants waive fees and provide up to €7,000 in student stipends. However, applicants must navigate the pre-enrollment steps via the Universitaly portal, get their Declaration of Value (DoV) or CIMEA certificate, and submit family income statements. Annex guides you through this complex process.",
    slug: "italy-scholarship-timeline",
  },
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Annex Journal
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Insights & admissions guides.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed">
              Read up-to-date analysis from our advisors detailing global admissions, visa policy changes, and study abroad steps.
            </p>
          </div>

          {!selectedPost ? (
            /* Post Listings Grid */
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="flex flex-col justify-between min-h-[300px]">
                  <div className="mb-6">
                    <span className="text-xs font-mono-data text-gold font-bold uppercase tracking-wider block mb-2">
                      {post.category}
                    </span>
                    <CardTitle className="text-xl mb-3 hover:text-gold transition-colors cursor-pointer" onClick={() => setSelectedPost(post)}>
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mb-4">
                      {post.excerpt}
                    </CardDescription>
                  </div>

                  <div className="border-t border-hairline pt-4 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-mono-data text-slate-400 font-semibold mb-4">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1"><User size={12} /> BY: {post.author.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-xs font-bold uppercase tracking-wider text-primary hover:text-gold transition-colors cursor-pointer"
                    >
                      Read Article &rarr;
                    </button>
                  </div>
                </Card>
              ))}
            </section>
          ) : (
            /* Selected Post Reader View */
            <article className="max-w-3xl mx-auto border border-hairline bg-subtle-gray/10 p-8 md:p-12 rounded-[2rem]">
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors mb-8 cursor-pointer"
              >
                <ArrowLeft size={12} /> Back to Journal
              </button>

              <span className="text-xs font-mono-data text-gold font-bold uppercase tracking-wider block mb-2">
                {selectedPost.category}
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight leading-snug mb-4">
                {selectedPost.title}
              </h2>

              <div className="flex gap-6 items-center text-xs font-mono-data text-slate-400 font-semibold mb-8 border-b border-hairline pb-4">
                <span className="flex items-center gap-1"><Calendar size={12} /> {selectedPost.date}</span>
                <span className="flex items-center gap-1"><User size={12} /> AUTHOR: {selectedPost.author.toUpperCase()}</span>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed space-y-4 max-w-[65ch]">
                <p>{selectedPost.content}</p>
                <p>
                  For personalized queries and profiling, speak with our certified advisors. We audit student academic transcripts and outline exact pathways for global admissions.
                </p>
              </div>
            </article>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
