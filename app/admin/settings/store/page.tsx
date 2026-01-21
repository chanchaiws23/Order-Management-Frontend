'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useStoreSettings, useUpdateStoreSettings, StoreSettings } from '@/lib/api/settings';

export default function StoreSettingsPage() {
  const { data: storeData, isLoading: isLoadingData } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();

  const [settings, setSettings] = useState<StoreSettings>({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    storeCurrency: 'THB',
    storeDescription: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (storeData) {
      setSettings(storeData);
    }
  }, [storeData]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast.success('Store settings saved successfully');
    } catch {
      toast.error('Failed to save store settings');
    }
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
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground">Configure your store information</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your store&apos;s basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeCurrency">Currency</Label>
              <Input
                id="storeCurrency"
                value={settings.storeCurrency}
                onChange={(e) => setSettings({ ...settings, storeCurrency: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Phone</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Store Logo</CardTitle>
            <CardDescription>Upload your store&apos;s logo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                {settings.logoUrl ? (
                  <Image
                    src={settings.logoUrl}
                    alt="Logo"
                    fill
                    className="rounded-lg object-contain"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Enter logo URL"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-80"
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 200x200px. Supported formats: PNG, JPG, SVG
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoadingData ? (
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      )}
    </div>
  );
}
