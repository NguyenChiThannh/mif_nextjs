import { GroupCarousel } from "@/app/[locale]/(root)/home/(components)/group-carousel"
import PostPublicSection from "@/app/[locale]/(root)/home/(sections)/post-public-section"
import Title from "@/components/title"

export function ContentSection({ t }) {
    return (
        <div className="col-span-2">
            <Title
                title={t('title_section_group')}
                isMore={false}
            />
            <div className="my-4">
                <GroupCarousel />
            </div>

            <Title
                title={t('title_section_public_post')}
                isMore={false}
            />
            <div className="my-4 lg:mb-24">
                <PostPublicSection />
            </div>
        </div>
    )
} 