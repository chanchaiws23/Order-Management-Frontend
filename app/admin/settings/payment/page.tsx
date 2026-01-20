'use client';

import { useState } from 'react';
import { ArrowLeft, Save, CreditCard, Wallet, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function PaymentSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    creditCard: { enabled: true, testMode: true },
    paypal: { enabled: true, clientId: '', testMode: true },
    bankTransfer: {
      enabled: true,
      bankName: 'Bangkok Bank',
      accountNumber: '123-456-7890',
      accountName: 'My Store Co., Ltd.',
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Payment settings saved successfully');
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
          <h1 className="text-3xl font-bold">Payment Settings</h1>
          <p className="text-muted-foreground">Configure payment methods and gateways</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Credit Card</CardTitle>
                  <CardDescription>Accept credit and debit card payments</CardDescription>
                </div>
              </div>
              <Checkbox
                checked={settings.creditCard.enabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({
                    ...settings,
                    creditCard: { ...settings.creditCard, enabled: checked },
                  })
                }
              />
            </div>
          </CardHeader>
          {settings.creditCard.enabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ccTestMode"
                  checked={settings.creditCard.testMode}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({
                      ...settings,
                      creditCard: { ...settings.creditCard, testMode: checked },
                    })
                  }
                />
                <Label htmlFor="ccTestMode">Test Mode (No real transactions)</Label>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>PayPal</CardTitle>
                  <CardDescription>Accept PayPal payments</CardDescription>
                </div>
              </div>
              <Checkbox
                checked={settings.paypal.enabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, paypal: { ...settings.paypal, enabled: checked } })
                }
              />
            </div>
          </CardHeader>
          {settings.paypal.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                <Input
                  id="paypalClientId"
                  value={settings.paypal.clientId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paypal: { ...settings.paypal, clientId: e.target.value },
                    })
                  }
                  placeholder="Enter your PayPal Client ID"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ppTestMode"
                  checked={settings.paypal.testMode}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, paypal: { ...settings.paypal, testMode: checked } })
                  }
                />
                <Label htmlFor="ppTestMode">Sandbox Mode (Test environment)</Label>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Bank Transfer</CardTitle>
                  <CardDescription>Accept direct bank transfers</CardDescription>
                </div>
              </div>
              <Checkbox
                checked={settings.bankTransfer.enabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({
                    ...settings,
                    bankTransfer: { ...settings.bankTransfer, enabled: checked },
                  })
                }
              />
            </div>
          </CardHeader>
          {settings.bankTransfer.enabled && (
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={settings.bankTransfer.bankName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, bankName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={settings.bankTransfer.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, accountNumber: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={settings.bankTransfer.accountName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, accountName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          )}
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
