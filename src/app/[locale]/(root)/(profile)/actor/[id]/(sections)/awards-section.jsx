import { Award } from 'lucide-react'
import Title from '@/components/title'

export default function AwardsSection({ awards, t }) {
    if (!awards?.length) return null;

    return (
        <div>
            <Title title={t("awards")} isMore={false} />
            <ul className="mt-4 space-y-2">
                {awards.map((award) => (
                    <li key={award.id} className="flex items-center gap-2 font-medium">
                        <Award className="text-yellow-500 w-5 h-5" />
                        <span>{award.name} - {award?.date?.split('-')[0]}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
} 