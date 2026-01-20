'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePendingReviews, useApproveReview, useRejectReview } from '@/lib/api/reviews';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const [search, setSearch] = useState('');
  const { data: reviews, isLoading } = usePendingReviews();
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();

  const handleApprove = async (id: string) => {
    try {
      await approveReview.mutateAsync(id);
      toast.success('Review approved');
    } catch {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview.mutateAsync(id);
      toast.success('Review rejected');
    } catch {
      toast.error('Failed to reject review');
    }
  };

  const filteredReviews =
    reviews?.filter(
      (review: any) =>
        review.title?.toLowerCase().includes(search.toLowerCase()) ||
        review.customerName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">Manage product reviews and ratings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
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

          {!isLoading && filteredReviews.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No pending reviews to moderate.
            </div>
          )}

          {filteredReviews.length > 0 && (
            <div className="space-y-4">
              {filteredReviews.map((review: any) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-medium">{review.customerName}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-semibold">{review.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDateTime(review.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(review.id)}
                        disabled={approveReview.isPending}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(review.id)}
                        disabled={rejectReview.isPending}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
