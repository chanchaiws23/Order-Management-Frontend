'use client';

import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Store,
  Truck,
  CreditCard,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and configurations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button variant="outline">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Role Management</CardTitle>
            </div>
            <CardDescription>Configure roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings/roles">
              <Button variant="outline">Manage Roles</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Store Settings</CardTitle>
            </div>
            <CardDescription>Configure store name, logo, and contact info</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings/store">
              <Button variant="outline">Configure Store</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <CardTitle>Shipping Settings</CardTitle>
            </div>
            <CardDescription>Configure shipping rates and methods</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings/shipping">
              <Button variant="outline">Configure Shipping</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Payment Settings</CardTitle>
            </div>
            <CardDescription>Configure payment methods and gateways</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings/payment">
              <Button variant="outline">Configure Payment</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure email and push notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings/notifications">
              <Button variant="outline">Configure Notifications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
