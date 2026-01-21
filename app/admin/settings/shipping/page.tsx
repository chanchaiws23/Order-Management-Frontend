'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useShippingSettings, useUpdateShippingSettings, ShippingMethod } from '@/lib/api/settings';

export default function ShippingSettingsPage() {
  const { data: shippingData, isLoading: isLoadingData } = useShippingSettings();
  const updateSettings = useUpdateShippingSettings();

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);

  useEffect(() => {
    if (shippingData) {
      setFreeShippingThreshold(shippingData.freeShippingThreshold);
      setMethods(shippingData.methods);
    }
  }, [shippingData]);

  const handleAddMethod = () => {
    const newMethod: ShippingMethod = {
      id: Date.now().toString(),
      name: 'New Shipping Method',
      price: 0,
      estimatedDays: '3-5',
      isActive: true,
    };
    setMethods([...methods, newMethod]);
  };

  const handleRemoveMethod = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
  };

  const handleUpdateMethod = (id: string, field: keyof ShippingMethod, value: any) => {
    setMethods(methods.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({ freeShippingThreshold, methods });
      toast.success('Shipping settings saved successfully');
    } catch {
      toast.error('Failed to save shipping settings');
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
          <h1 className="text-3xl font-bold">Shipping Settings</h1>
          <p className="text-muted-foreground">Configure shipping rates and methods</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Free Shipping</CardTitle>
          <CardDescription>Set minimum order amount for free shipping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="threshold">Free shipping for orders over</Label>
            <Input
              id="threshold"
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-muted-foreground">THB</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Shipping Methods</CardTitle>
            <CardDescription>Configure available shipping options</CardDescription>
          </div>
          <Button onClick={handleAddMethod} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Method
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="flex items-center gap-4 rounded-lg border p-4">
              <div className="grid flex-1 grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    value={method.name}
                    onChange={(e) => handleUpdateMethod(method.id, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Price (THB)</Label>
                  <Input
                    type="number"
                    value={method.price}
                    onChange={(e) => handleUpdateMethod(method.id, 'price', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Estimated Days</Label>
                  <Input
                    value={method.estimatedDays}
                    onChange={(e) => handleUpdateMethod(method.id, 'estimatedDays', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Active</Label>
                  <div className="pt-2">
                    <Checkbox
                      checked={method.isActive}
                      onCheckedChange={(checked: boolean) =>
                        handleUpdateMethod(method.id, 'isActive', checked)
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => handleRemoveMethod(method.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

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
