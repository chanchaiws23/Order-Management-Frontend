'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
}

export default function ShippingSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [methods, setMethods] = useState<ShippingMethod[]>([
    { id: '1', name: 'Standard Shipping', price: 50, estimatedDays: '3-5', isActive: true },
    { id: '2', name: 'Express Shipping', price: 100, estimatedDays: '1-2', isActive: true },
    { id: '3', name: 'Same Day Delivery', price: 200, estimatedDays: 'Same day', isActive: false },
  ]);

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
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Shipping settings saved successfully');
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
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-4 gap-4">
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
                      onCheckedChange={(checked: boolean) => handleUpdateMethod(method.id, 'isActive', checked)}
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

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
