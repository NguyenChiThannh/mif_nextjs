import { Button } from '@/components/ui/button'
import { CheckIcon, XIcon } from 'lucide-react'

export default function PlanCard({ plan }) {
  return (
    <div className='border rounded-lg overflow-hidden'>
      <div className='bg-primary text-primary-foreground p-6 text-center'>
        <h2 className='text-2xl font-bold'>{plan.name}</h2>
        <p className='text-4xl font-bold'>{plan.price}</p>
      </div>
      <div className='p-6 space-y-4'>
        {plan.features.map((feature, index) => (
          <div key={index} className='flex items-center gap-2'>
            {feature.included ? (
              <CheckIcon className='w-5 h-5 text-green-500' />
            ) : (
              <XIcon className='w-5 h-5 text-red-500' />
            )}
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
      <div className='bg-muted p-4 text-center'>
        <Button className='w-full'>Sign Up</Button>
      </div>
    </div>
  )
}
