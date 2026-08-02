import React from "react";

/**
 * Organization Schema (Global E-E-A-T & Brand Trust)
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Annex Consultancy",
    "alternateName": ["Annex Educational Consultancy", "Annex Study Abroad Consultants"],
    "url": "https://annex-consultancy.com",
    "logo": "https://annex-consultancy.com/images/logo.jpeg",
    "description": "Premier global education and study abroad consultancy helping international students secure admissions, scholarships, visas, and placements in top universities across UK, Australia, USA, Canada, Germany, Europe, Dubai, and Italy.",
    "telephone": "+91 89108 82334",
    "email": "business@annex-consultancy.com",
    "sameAs": [
      "https://wa.me/918910882334"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "India"
    },
    "knowsAbout": [
      "Study Abroad Counseling",
      "University Admissions",
      "Student Visa Guidance",
      "Scholarships & Financial Aid",
      "IELTS & PTE Test Preparation",
      "SOP & LOR Statement Writing",
      "Post-Study Work Permits"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * LocalBusiness Schema (Local SEO & MAP Consistency)
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Annex Consultancy - Study Abroad & Overseas Education Consultants",
    "image": "https://annex-consultancy.com/images/logo.jpeg",
    "@id": "https://annex-consultancy.com/#localbusiness",
    "url": "https://annex-consultancy.com",
    "telephone": "+91 89108 82334",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Annex Consultancy HQ",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700001",
      "addressCountry": "India"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.5726,
      "longitude": 88.3639
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:30",
      "closes": "18:30"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage Schema (Rich Snippets & Voice Search SERP Features)
 */
export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList Schema (Rich Navigation Trails in Search Results)
 */
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
