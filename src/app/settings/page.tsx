'use client';

import { PasswordForm, ProfileForm, RolesForm } from '@/components/settings';
import { Tabs, TabsContent } from '@/components/ui';

import { Layout } from '@/components/ui';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('edit-info');

  const tabs = [
    { label: 'Edit Info', value: 'edit-info' },
    { label: 'Password Reset', value: 'password-reset' },
    { label: 'Roles', value: 'roles' },
  ];

  return (
    <Layout title="Settings" description="Manage your bookings with ease.">
      <div className="space-y-4">
        <Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} />

        <TabsContent value="edit-info" activeValue={activeTab}>
          <ProfileForm />
        </TabsContent>

        <TabsContent value="password-reset" activeValue={activeTab}>
          <PasswordForm />
        </TabsContent>

        <TabsContent value="roles" activeValue={activeTab}>
          <RolesForm />
        </TabsContent>
      </div>
    </Layout>
  );
}
