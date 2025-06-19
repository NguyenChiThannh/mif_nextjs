import MovieHotSection from '@/app/[locale]/(root)/home/(sections)/hot-movie-section'
import RandomMovieSection from '@/app/[locale]/(root)/home/(sections)/random-movie-section'
import Title from '@/components/title'

export function SidebarSection({ t }) {
  return (
    <div className="grid mb-8 gap-6 md:gap-8 lg:gap-8 h-fit">
      <Title
        title={t('title_section_hot_movies')}
        isMore={true}
        redirect="/movies"
      />
      <div className="grid gap-5">
        <MovieHotSection />
      </div>

      <Title
        title={t('title_section_hot_movies')}
        isMore={true}
        redirect="/movies"
      />
      <div className="grid gap-5">
        <RandomMovieSection />
      </div>
    </div>
  )
}
