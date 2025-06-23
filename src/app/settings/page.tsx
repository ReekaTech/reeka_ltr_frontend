'use client';

import { PasswordForm, ProfileForm, RolesForm } from '@/components/settings';
import { Tabs, TabsContent } from '@/components/ui';

import { Layout } from '@/components/ui';
import { RevenueSettings } from '@/components/settings/revenue-settings-form';
import { RoleProtection } from '@/components/hocs/with-role-protection';
import { useState } from 'react';
import { useRoleAccess } from '@/hooks/use-role-navigation';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('edit-info');
  const { isAdmin } = useRoleAccess();

  const tabs = [
    { label: 'Edit Info', value: 'edit-info' },
    { label: 'Password Reset', value: 'password-reset' },
    // Only show Roles tab to Admin users
    ...(isAdmin ? [{ label: 'Roles', value: 'roles' }] : []),
  ];

  return (
    <RoleProtection requiredModule="settings">
      <Layout title="Settings" description="Manage your bookings with ease.">
        <div className="space-y-4">
          <Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} />

          <TabsContent value="edit-info" activeValue={activeTab}>
            <ProfileForm />
          </TabsContent>

          <TabsContent value="password-reset" activeValue={activeTab}>
            <PasswordForm />
          </TabsContent>

          {/* Only render Roles tab content for Admin users */}
          {isAdmin && (
            <TabsContent value="roles" activeValue={activeTab}>
              <RolesForm />
            </TabsContent>
          )}
        </div>
      </Layout>
    </RoleProtection>
  );
}
