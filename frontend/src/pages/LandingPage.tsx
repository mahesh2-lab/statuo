import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { TechMarquee } from '@/components/landing/TechMarquee';
import { FeatureStrip } from '@/components/landing/FeatureStrip';
import { IntegrationSection } from '@/components/landing/IntegrationSection';
import { AIClientSection } from '@/components/landing/AIClientSection';
import { StatusPagesSection } from '@/components/landing/StatusPagesSection';
import { TemplatesSection } from '@/components/landing/TemplatesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PricingSection } from '@/components/landing/PricingSection';
import { EnterpriseBand } from '@/components/landing/EnterpriseBand';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <main>
        <HeroSection />
        <TechMarquee />
        <FeatureStrip />
        <IntegrationSection />
        <AIClientSection />
        <StatusPagesSection />
        <TemplatesSection />
        <HowItWorks />
        <PricingSection />
        <EnterpriseBand />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
