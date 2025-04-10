import { Button } from '@/components/ui/button'
import { UserType } from '@/types/banking'

interface UserTypeSelectorProps {
  userType: UserType
  setUserType: (type: UserType) => void
}

export function UserTypeSelector({
  userType,
  setUserType,
}: UserTypeSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4 text-blue-800">
        Select User Type
      </h2>
      <div className="flex flex-wrap gap-4">
        <Button
          variant={userType === 'assembler' ? 'default' : 'outline'}
          onClick={() => setUserType('assembler')}
          className={
            userType === 'assembler'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'border-blue-300 text-blue-600'
          }
        >
          Assembler
        </Button>
        <Button
          variant={userType === 'buyer' ? 'default' : 'outline'}
          onClick={() => setUserType('buyer')}
          className={
            userType === 'buyer'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'border-blue-300 text-blue-600'
          }
        >
          Buyer
        </Button>
        <Button
          variant={userType === 'corporation' ? 'default' : 'outline'}
          onClick={() => setUserType('corporation')}
          className={
            userType === 'corporation'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'border-blue-300 text-blue-600'
          }
        >
          Corporation
        </Button>
      </div>
    </div>
  )
}
