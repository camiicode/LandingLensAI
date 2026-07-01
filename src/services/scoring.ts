import type { ExtractedData } from './extractor';

export interface ScoreResult {
  overall: number;
  sections: {
    hero: number;
    ctas: number;
    forms: number;
    seo: number;
    accessibility: number;
    socialProof: number;
  };
  details: {
    title: { score: number; message: string };
    description: { score: number; message: string };
    headings: { score: number; message: string };
    ctas: { score: number; message: string };
    forms: { score: number; message: string };
    images: { score: number; message: string };
  };
  sectionMessages: Record<string, { score: number; message: string }>;
}

export function calculateScore(data: ExtractedData): ScoreResult {
  const titleScore = data.title.length >= 20 && data.title.length <= 70 ? 100 :
                     data.title.length > 0 ? 50 : 0;
  const titleMessage = data.title.length >= 20 && data.title.length <= 70
    ? 'Optimal length (20-70 characters)'
    : data.title.length > 0
      ? 'Adjust the title length'
      : 'Missing title';

  const descScore = data.description.length >= 50 && data.description.length <= 160 ? 100 :
                     data.description.length > 0 ? 50 : 0;
  const descMessage = data.description.length >= 50 && data.description.length <= 160
    ? 'Optimal length (50-160 characters)'
    : data.description.length > 0
      ? 'Adjust the description length'
      : 'Missing meta description';

  const headingScore = data.headings.length >= 2 ? 100 :
                       data.headings.length === 1 ? 50 : 0;
  const headingMessage = data.headings.length >= 2
    ? 'Good use of headings'
    : data.headings.length === 1
      ? 'Add more headings (H1, H2, H3)'
      : 'No headings found';

  const ctaCount = data.ctas.length;
  const ctaScore = ctaCount >= 2 ? 100 :
                   ctaCount === 1 ? 60 : 0;
  const ctaMessage = ctaCount >= 2
    ? 'Multiple CTAs detected'
    : ctaCount === 1
      ? 'Only one CTA, consider adding more'
      : 'No CTAs detected';

  const formCount = data.forms.length;
  const formScore = formCount >= 1 ? 100 : 0;
  const formMessage = formCount >= 1
    ? 'Form detected'
    : 'No capture form found';

  const imgCount = data.images.length;
  const imgScore = imgCount >= 3 ? 100 :
                   imgCount >= 1 ? 60 : 0;
  const imgMessage = imgCount >= 3
    ? 'Good number of images'
    : imgCount >= 1
      ? 'Add more visual images'
      : 'No images found';

  const sections = {
    hero: Math.round((titleScore + headingScore) / 2),
    ctas: ctaScore,
    forms: formScore,
    seo: Math.round((titleScore + descScore) / 2),
    accessibility: Math.round((headingScore + (imgCount > 0 ? 100 : 50)) / 2),
    socialProof: Math.round((imgCount >= 2 ? 80 : 40) + (data.links.length > 5 ? 20 : 0)),
  };

  const overall = Math.round(
    Object.values(sections).reduce((a, b) => a + b, 0) / Object.values(sections).length
  );

  const sectionMessages: Record<string, { score: number; message: string }> = {
    hero: {
      score: sections.hero,
      message: data.title
        ? (sections.hero >= 70 ? 'Good value proposition' : 'Could be improved, optimize the title')
        : 'Missing main title',
    },
    ctas: {
      score: sections.ctas,
      message: data.ctas.length > 0
        ? (sections.ctas >= 70 ? 'Effective and sufficient CTAs' : 'CTAs present but could be improved')
        : 'No CTAs detected',
    },
    forms: {
      score: sections.forms,
      message: data.forms.length > 0
        ? 'Capture form detected'
        : 'No capture form found',
    },
    seo: {
      score: sections.seo,
      message: data.title && data.description
        ? (sections.seo >= 70 ? 'Good on-page SEO' : 'Improve SEO metadata')
        : 'Missing SEO metadata (title and description)',
    },
    accessibility: {
      score: sections.accessibility,
      message: data.headings.length > 0
        ? (sections.accessibility >= 70 ? 'Good accessibility structure' : 'Heading structure could be improved')
        : 'Missing heading structure',
    },
    socialProof: {
      score: sections.socialProof,
      message: data.images.length >= 2 || data.links.length > 5
        ? 'Trust signals detected'
        : 'Add more social proof (images, testimonials)',
    },
  };

  return {
    overall,
    sections,
    details: {
      title: { score: titleScore, message: titleMessage },
      description: { score: descScore, message: descMessage },
      headings: { score: headingScore, message: headingMessage },
      ctas: { score: ctaScore, message: ctaMessage },
      forms: { score: formScore, message: formMessage },
      images: { score: imgScore, message: imgMessage },
    },
    sectionMessages,
  };
}
