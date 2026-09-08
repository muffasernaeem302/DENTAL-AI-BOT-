import { Card, CardTitle, Button, Input, Avatar } from '@/components/ui'
import { useAuth } from '@/hooks'

export function PatientProfilePage() {
  const { user, updateProfile } = useAuth()

  if (!user) return null

  const [firstName = '', ...lastNameParts] = user.full_name.split(' ')
  const lastName = lastNameParts.join(' ')

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-neutral-600">Manage your personal information</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-center gap-6">
          <Avatar firstName={user.firstName || firstName} lastName={user.lastName || lastName} size="xl" />
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{user.firstName} {user.lastName}</h2>
            <p className="text-neutral-600">{user.email}</p>
            <p className="text-sm text-neutral-500">Patient</p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardTitle className="mb-4">Personal Information</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First Name" defaultValue={user.firstName} />
          <Input label="Last Name" defaultValue={user.lastName} />
          <Input label="Email" type="email" defaultValue={user.email} />
          <Input label="Phone" type="tel" defaultValue={user.phone || ''} />
          <Input label="Date of Birth" type="date" defaultValue={user.dateOfBirth || ''} className="sm:col-span-2" />
        </div>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardTitle className="mb-4">Medical Information</CardTitle>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Medical History</label>
            <textarea
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              rows={3}
              defaultValue={user.medicalHistory || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Allergies</label>
            <div className="flex flex-wrap gap-2">
              {user.allergies?.map((allergy, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                  {allergy}
                </span>
              )) || <span className="text-neutral-500 text-sm">None reported</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardTitle className="mb-4">Insurance Information</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Insurance Provider" defaultValue={user.insuranceProvider || ''} />
          <Input label="Policy Number" defaultValue={user.insuranceNumber || ''} />
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={() => updateProfile(user)}>Save Changes</Button>
      </div>
    </div>
  )
}
