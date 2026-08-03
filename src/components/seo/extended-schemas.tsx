import React from "react";

/**
 * CollegeOrUniversity Schema for University Detail Pages
 */
export function CollegeOrUniversitySchema({
  name,
  url,
  logo,
  country,
  city,
  description,
}: {
  name: string;
  url: string;
  logo?: string;
  country: string;
  city: string;
  description: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": name,
    "url": url,
    "logo": logo || "https://annex-consultancy.com/images/logo.jpeg",
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": country,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * EducationalOccupationalProgram Schema for Course Detail Pages
 */
export function EducationalOccupationalProgramSchema({
  name,
  description,
  providerName,
  educationalCredentialAwarded,
}: {
  name: string;
  description: string;
  providerName?: string;
  educationalCredentialAwarded?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": name,
    "description": description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": providerName || "Annex Consultancy",
      "url": "https://annex-consultancy.com",
    },
    "educationalCredentialAwarded": educationalCredentialAwarded || "Degree / Master's / Diploma",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * City LocalBusiness Schema for Local SEO City Landing Pages
 */
export function CityLocalBusinessSchema({
  cityName,
  citySlug,
}: {
  cityName: string;
  citySlug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Annex Consultancy - Study Abroad & Overseas Education Consultants in ${cityName}`,
    "image": "https://annex-consultancy.com/images/logo.jpeg",
    "@id": `https://annex-consultancy.com/study-abroad-consultant-${citySlug}#localbusiness`,
    "url": `https://annex-consultancy.com/study-abroad-consultant-${citySlug}`,
    "telephone": "+91 89108 82334",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "West Bengal / East India",
      "addressCountry": "India",
    },
    "areaServed": cityName,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * HowTo Schema for Step-by-Step Guides & Visa Workflows
 */
export function HowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string; url?: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url || undefined,
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
 * DefinedTerm Schema for Glossary Term Detail Pages
 */
export function DefinedTermSchema({
  term,
  definition,
  url,
  inDefinedTermSet = "https://annex-consultancy.com/glossary",
}: {
  term: string;
  definition: string;
  url: string;
  inDefinedTermSet?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": term,
    "description": definition,
    "url": url,
    "inDefinedTermSet": inDefinedTermSet,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * DefinedTermSet Schema for Glossary Directory Hub Page
 */
export function DefinedTermSetSchema({
  name = "Study Abroad Terminology & Entity Knowledge Base",
  description = "A-Z Glossary of international education, visa, scholarship, and admission terms.",
  terms,
}: {
  name?: string;
  description?: string;
  terms: { name: string; description: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": name,
    "description": description,
    "@id": "https://annex-consultancy.com/glossary#termset",
    "hasDefinedTerm": terms.map((t) => ({
      "@type": "DefinedTerm",
      "name": t.name,
      "description": t.description,
      "url": t.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
