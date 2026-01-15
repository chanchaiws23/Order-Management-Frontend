'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoupons, useDeleteCoupon, useToggleCoupon } from '@/lib/api/coupons';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
  const [search, setSearch] = useState('');
  const { data: coupons, isLoading } = useCoupons();
  const deleteCoupon = useDeleteCoupon();
  const toggleCoupon = useToggleCoupon();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await deleteCoupon.mutateAsync(id);
      toast.success('Coupon deleted successfully');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleCoupon.mutateAsync(id);
      toast.success('Coupon status updated');
    } catch {
      toast.error('Failed to update coupon status');
    }
  };

  const filteredCoupons = coupons?.filter((coupon: any) =>
    coupon.code?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount coupons</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon List</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search coupons..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && filteredCoupons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No coupons found. Create your first coupon to get started.
            </div>
          )}

          {filteredCoupons.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Code</th>
                    <th className="text-left py-3 px-4 font-medium">Discount</th>
                    <th className="text-left py-3 px-4 font-medium">Usage</th>
                    <th className="text-left py-3 px-4 font-medium">Valid Until</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon: any) => (
                    <tr key={coupon.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold">{coupon.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        {coupon.discountType === 'PERCENTAGE' 
                          ? `${coupon.discountValue}%`
                          : formatPrice(coupon.discountValue)
                        }
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {coupon.usageCount} / {coupon.usageLimit || '∞'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(coupon.validUntil)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleToggle(coupon.id)}
                          >
                            {coupon.isActive 
                              ? <ToggleRight className="h-4 w-4 text-green-600" />
                              : <ToggleLeft className="h-4 w-4 text-gray-400" />
                            }
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(coupon.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
