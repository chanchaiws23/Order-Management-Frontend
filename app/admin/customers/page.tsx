'use client';

import { useState } from 'react';
import { Search, Eye, Trash2, Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers, useDeleteCustomer } from '@/lib/api/customers';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const { data: customers, isLoading } = useCustomers({ search });
  const deleteCustomer = useDeleteCustomer();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await deleteCustomer.mutateAsync(id);
      toast.success('Customer deleted successfully');
    } catch {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer base</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
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

          {!isLoading && (!customers || customers.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No customers found
            </div>
          )}

          {customers && customers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 font-medium">Joined</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer: any) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {customer.phone || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDateTime(customer.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(customer.id)}
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
