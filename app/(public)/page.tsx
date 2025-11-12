import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesGrid } from '@/components/landing/features-grid'
import { PricingSection } from '@/components/landing/pricing-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { FinalCTA } from '@/components/landing/final-cta'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <PricingSection />
      <SocialProofSection />
      <FinalCTA />
    </>
  )
}
