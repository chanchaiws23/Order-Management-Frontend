'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Mail, Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function NotificationSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      orderCancelled: true,
      lowStock: true,
      newReview: false,
    },
    admin: {
      newOrder: true,
      lowStock: true,
      newReview: true,
      newCustomer: false,
    },
    smtp: {
      host: 'smtp.gmail.com',
      port: '587',
      username: '',
      password: '',
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Notification settings saved successfully');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Configure email and push notifications</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Customer Email Notifications</CardTitle>
                <CardDescription>Emails sent to customers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Order Confirmation</Label>
              <Checkbox
                checked={settings.email.orderConfirmation}
                onCheckedChange={(checked: boolean) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, orderConfirmation: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Order Shipped</Label>
              <Checkbox
                checked={settings.email.orderShipped}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, email: { ...settings.email, orderShipped: checked } })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Order Delivered</Label>
              <Checkbox
                checked={settings.email.orderDelivered}
                onCheckedChange={(checked: boolean) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, orderDelivered: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Order Cancelled</Label>
              <Checkbox
                checked={settings.email.orderCancelled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, orderCancelled: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Admin Notifications</CardTitle>
                <CardDescription>Notifications for administrators</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>New Order</Label>
              <Checkbox
                checked={settings.admin.newOrder}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, admin: { ...settings.admin, newOrder: checked } })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Low Stock Alert</Label>
              <Checkbox
                checked={settings.admin.lowStock}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, admin: { ...settings.admin, lowStock: checked } })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>New Review</Label>
              <Checkbox
                checked={settings.admin.newReview}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, admin: { ...settings.admin, newReview: checked } })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>New Customer Registration</Label>
              <Checkbox
                checked={settings.admin.newCustomer}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, admin: { ...settings.admin, newCustomer: checked } })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Email server settings for sending notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtp.host}
                  onChange={(e) =>
                    setSettings({ ...settings, smtp: { ...settings.smtp, host: e.target.value } })
                  }
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtp.port}
                  onChange={(e) =>
                    setSettings({ ...settings, smtp: { ...settings.smtp, port: e.target.value } })
                  }
                  placeholder="587"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtp.username}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, username: e.target.value },
                    })
                  }
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtp.password}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, password: e.target.value },
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
