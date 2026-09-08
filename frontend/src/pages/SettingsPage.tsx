import { Card, CardTitle, Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardTitle className="mb-4">Profile Information</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" defaultValue={user?.firstName} />
            <Input label="Last Name" defaultValue={user?.lastName} />
            <Input label="Email" type="email" defaultValue={user?.email} className="sm:col-span-2" />
            <Input label="Phone" type="tel" defaultValue={user?.phone || ''} className="sm:col-span-2" />
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardTitle className="mb-4">Notifications</CardTitle>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Email Notifications</p>
                <p className="text-sm text-neutral-500">Receive appointment reminders via email</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">SMS Notifications</p>
                <p className="text-sm text-neutral-500">Receive text message reminders</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Marketing Communications</p>
                <p className="text-sm text-neutral-500">Receive updates about new features</p>
              </div>
              <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
            </label>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <CardTitle className="mb-4">Security</CardTitle>
          <div className="space-y-4">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Update Password</Button>
          </div>
        </Card>

        {/* API Settings (Backend) */}
        <Card>
          <CardTitle className="mb-4">AI Configuration</CardTitle>
          <p className="text-sm text-neutral-600 mb-4">
            Configure your AI assistant settings. API keys are managed server-side.
          </p>
          <div className="space-y-4">
            <Input 
              label="LLM Provider" 
              defaultValue="OpenAI" 
              helperText="Currently using OpenAI GPT-4" 
            />
            <Input 
              label="Temperature" 
              type="number" 
              step="0.1" 
              min="0" 
              max="1" 
              defaultValue="0.7"
              helperText="Controls response creativity (0 = focused, 1 = creative)"
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardTitle className="text-red-600 mb-4">Danger Zone</CardTitle>
          <p className="text-sm text-neutral-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger">Delete Account</Button>
        </Card>
      </div>
    </div>
  )
}
