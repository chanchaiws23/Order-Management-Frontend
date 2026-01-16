'use client';

import { useState } from 'react';
import { ArrowLeft, Shield, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const roles = [
  {
    name: 'SUPER_ADMIN',
    description: 'Full system access with all permissions',
    level: 100,
    permissions: ['all'],
    color: 'bg-red-500',
  },
  {
    name: 'ADMIN',
    description: 'Administrative access to manage orders, products, and users',
    level: 80,
    permissions: ['manage_orders', 'manage_products', 'manage_users', 'manage_coupons', 'view_reports'],
    color: 'bg-orange-500',
  },
  {
    name: 'MANAGER',
    description: 'Can manage orders and view reports',
    level: 60,
    permissions: ['manage_orders', 'view_products', 'view_reports'],
    color: 'bg-yellow-500',
  },
  {
    name: 'STAFF',
    description: 'Basic staff access for order processing',
    level: 40,
    permissions: ['view_orders', 'update_order_status', 'view_products'],
    color: 'bg-blue-500',
  },
  {
    name: 'CUSTOMER',
    description: 'Regular customer with shopping access',
    level: 10,
    permissions: ['view_products', 'create_orders', 'view_own_orders'],
    color: 'bg-green-500',
  },
];

const allPermissions = [
  { key: 'manage_orders', label: 'Manage Orders' },
  { key: 'view_orders', label: 'View Orders' },
  { key: 'update_order_status', label: 'Update Order Status' },
  { key: 'manage_products', label: 'Manage Products' },
  { key: 'view_products', label: 'View Products' },
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'manage_coupons', label: 'Manage Coupons' },
  { key: 'view_reports', label: 'View Reports' },
  { key: 'create_orders', label: 'Create Orders' },
  { key: 'view_own_orders', label: 'View Own Orders' },
];

export default function RoleManagementPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const hasPermission = (role: typeof roles[0], permission: string) => {
    return role.permissions.includes('all') || role.permissions.includes(permission);
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
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Configure roles and permissions</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle>System Roles</CardTitle>
            <CardDescription>Click on a role to view its permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.name}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === role.name ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedRole(role.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Level {role.level}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole ? `${selectedRole} Permissions` : 'Permissions Matrix'}
            </CardTitle>
            <CardDescription>
              {selectedRole ? 'Permissions granted to this role' : 'Select a role to view permissions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className="space-y-2">
                {allPermissions.map((permission) => {
                  const role = roles.find((r) => r.name === selectedRole)!;
                  const has = hasPermission(role, permission.key);
                  return (
                    <div
                      key={permission.key}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <span className="text-sm">{permission.label}</span>
                      {has ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mb-4" />
                <p>Select a role to view its permissions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy</CardTitle>
          <CardDescription>Higher level roles inherit permissions from lower levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {roles.map((role, index) => (
              <div key={role.name} className="flex items-center gap-2">
                <Badge className={role.color}>{role.name}</Badge>
                {index < roles.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
