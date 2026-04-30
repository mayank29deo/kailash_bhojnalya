import Hero from '../components/home/Hero.jsx';
import LandingThaliIntro from '../components/home/LandingThaliIntro.jsx';
import ThaliSpotlight from '../components/home/ThaliSpotlight.jsx';
import HeritageStrip from '../components/home/HeritageStrip.jsx';
import Storefront from '../components/home/Storefront.jsx';
import FeaturedDishes from '../components/home/FeaturedDishes.jsx';
import Reviews from '../components/home/Reviews.jsx';
import VisitCta from '../components/home/VisitCta.jsx';

export default function Home() {
  return (
    <>
      <LandingThaliIntro />
      <Hero />
      <ThaliSpotlight />
      <HeritageStrip />
      <Storefront />
      <FeaturedDishes />
      <Reviews />
      <VisitCta />
    </>
  );
}
