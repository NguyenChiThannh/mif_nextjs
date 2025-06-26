import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userApi } from '@/services/userApi'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DialogPromoteUser({ isOpen, onClose, userData }) {
  const [role, setRole] = useState('')
  const changeRoleMutation = userApi.mutation.useChangeUserRole()

  useEffect(() => {
    if (userData?.authorities?.length > 0) {
      setRole(userData.authorities.at(-1).authority.replace('ROLE_', ''))
    }
  }, [userData])

  const handleRoleChange = (value) => {
    setRole(value)
  }

  const handleSave = () => {
    changeRoleMutation.mutate(
      {
        userId: userData.id,
        role: role,
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Promote</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='role' className='text-right'>
            Role
          </Label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className='col-span-3'>
              <SelectValue placeholder='Select a Role'>
                {role === 'ADMIN'
                  ? 'Admin'
                  : role === 'CONTENT_CREATOR'
                    ? 'Content Creator'
                    : 'User'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Role</SelectLabel>
                <SelectItem value='USER'>User</SelectItem>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='CONTENT_CREATOR'>Content Creator</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={changeRoleMutation.isPending}>
            {changeRoleMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
