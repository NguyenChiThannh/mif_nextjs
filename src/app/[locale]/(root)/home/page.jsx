import ActorCarousel from "@/components/actor-carousel"
import { MainCarousel } from "@/components/main-carousel"
import Title from "@/components/title"
import { useTranslations } from "next-intl"
import MovieHotSection from "@/app/[locale]/(root)/home/(section)/hot-movie-section"
import PostPublicSection from "@/app/[locale]/(root)/home/(section)/post-public-section"
import RandomMovieSection from "@/app/[locale]/(root)/home/(section)/random-movie-section"


export default function Home() {
  const t = useTranslations('Home');
  return (
    <>
      <div className="w-full">
        <MainCarousel />

        <div className="pt-8 md:pt-12 lg:pt-16">
          <Title title={t('title_section_actor')} isMore='true' redirect='/actor' />
          <ActorCarousel />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 pt-8 md:pt-12 lg:pt-16">

          <div className="col-span-2">
            <Title title={t('title_section_news')} isMore='true' redirect='/news' />
            <div className="mb-4 lg:mb-24">
              <PostPublicSection />
            </div>
          </div>

          <div className="grid mb-8 gap-6 md:gap-8 lg:gap-8 h-fit">

            <Title title={t('title_section_hot_moives')} isMore='true' redirect='/movies' />
            <div className="grid gap-5">
              <MovieHotSection />
            </div>
            <Title title={t('title_section_random_moives')} isMore='true' redirect='/movies' />
            <div className="grid gap-5">
              <RandomMovieSection />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}