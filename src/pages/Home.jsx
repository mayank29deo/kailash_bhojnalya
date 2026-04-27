import Hero from '../components/home/Hero.jsx';
import HeritageStrip from '../components/home/HeritageStrip.jsx';
import FeaturedDishes from '../components/home/FeaturedDishes.jsx';
import Reviews from '../components/home/Reviews.jsx';
import VisitCta from '../components/home/VisitCta.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <HeritageStrip />
      <FeaturedDishes />
      <Reviews />
      <VisitCta />
    </>
  );
}
