import PlanCard from '@/app/[locale]/(root)/membership-plan/(component)/plan-card'
import { Button } from '@/components/ui/button'
import { CheckIcon, XIcon } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: '$9/mo',
    features: [
      { text: 'Access to all articles', included: true },
      { text: 'Exclusive newsletter', included: true },
      { text: 'Community forums', included: true },
      { text: 'Premium features', included: false },
      { text: 'Personalized support', included: false },
    ],
  },
  {
    name: 'Premium',
    price: '$19/mo',
    features: [
      { text: 'Access to all articles', included: true },
      { text: 'Exclusive newsletter', included: true },
      { text: 'Community forums', included: true },
      { text: 'Premium features', included: true },
      { text: 'Personalized support', included: true },
    ],
  },
]

export default function Component() {
  return (
    <div className='w-full max-w-3xl mx-auto pb-12 md:pb-24'>
      {/* Header */}
      <div className='space-y-4 text-center'>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          Membership Plans
        </h1>
        <p className='max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed'>
          Choose the plan that fits your needs and unlock exclusive benefits.
        </p>
      </div>
      {/* Plan Cards */}
      <div className='grid gap-6 mt-8 md:grid-cols-2'>
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  )
}
