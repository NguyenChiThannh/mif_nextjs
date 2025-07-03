import { MainCarousel } from '@/app/[locale]/(root)/home/(components)/main-carousel'
import ActorCarousel from '@/app/[locale]/(root)/home/(components)/actor-carousel'
import Title from '@/components/title'

export function MainSection({ t }) {
  return (
    <>
      <MainCarousel t={t} />
      <div className='pt-8 md:pt-12 lg:pt-16'>
        <Title
          title={t('title_section_actor')}
          isMore={true}
          redirect='/actor'
        />
        <ActorCarousel />
      </div>
    </>
  )
}
