'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  FileTextIcon,
  ExternalLinkIcon,
  CalendarIcon,
  DollarSignIcon,
  HomeIcon,
  ShieldIcon,
} from './icons';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface PolicyData {
  id: string;
  policy_number: string;
  carrier: string;
  policy_type: string;
  status: string;
  policy_period: {
    effective_date: string;
    expiration_date: string;
  };
  property: {
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  coverages: {
    dwelling?: { limit: number };
    personal_property?: { limit: number };
    personal_liability?: { limit: number };
    medical_payments?: { limit: number };
  };
  premium: {
    annual_total: number;
  };
  deductibles?: {
    amount?: number;
    type?: string;
  };
  documents?: Array<{
    type: string;
    filename: string;
    storage_path: string;
  }>;
}

interface PolicySheetProps {
  user: User;
  children: React.ReactNode;
}

export function PolicySheet({ user, children }: PolicySheetProps) {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchUserPolicies = useCallback(async () => {
    if (!user || policies.length > 0) return; // Don't refetch if already loaded

    setLoading(true);
    try {
      const supabase = createClient();

      // Query all policies - RLS will automatically filter to only show
      // policies where the user's profile_id matches the policyholder's profile_id
      const { data: policyData, error: policyError } = await supabase
        .from('policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (policyError) {
        console.error('Error fetching policies:', policyError);
        return;
      }

      setPolicies(policyData || []);
    } catch (error) {
      console.error('Error fetching user policies:', error);
    } finally {
      setLoading(false);
    }
  }, [user, policies.length]);

  useEffect(() => {
    if (open) {
      fetchUserPolicies();
    }
  }, [open, fetchUserPolicies]);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openPolicyDocument = async (storagePath: string) => {
    const supabase = createClient();

    try {
      // Create a signed URL for authenticated access (valid for 1 hour)
      const { data, error } = await supabase.storage
        .from('homefax-documents')
        .createSignedUrl(storagePath, 3600);

      if (error) {
        console.error('Error creating signed URL:', error);
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.error(
          'Failed to generate signed URL for document:',
          storagePath,
        );
      }
    } catch (error) {
      console.error('Error accessing document:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="overflow-y-auto w-full sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[1000px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileTextIcon />
            My Policies
          </SheetTitle>
          <SheetDescription>
            View your insurance policy details and access policy documents.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Loading policies...
              </div>
            </div>
          ) : policies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileTextIcon size={48} />
              <h3 className="text-lg font-medium">No Policies Found</h3>
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any active policies linked to your account.
              </p>
            </div>
          ) : (
            policies.map((policy) => (
              <Card key={policy.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {policy.carrier}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Policy #{policy.policy_number}
                      </p>
                    </div>
                    <Badge
                      variant={
                        policy.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {policy.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Top row with key info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Property Address */}
                    <div className="flex items-start gap-3">
                      <HomeIcon size={16} />
                      <div>
                        <p className="text-sm font-medium">Property Address</p>
                        <p className="text-sm text-muted-foreground">
                          {policy.property?.address?.street}
                          <br />
                          {policy.property?.address?.city},{' '}
                          {policy.property?.address?.state}{' '}
                          {policy.property?.address?.zip}
                        </p>
                      </div>
                    </div>

                    {/* Policy Period */}
                    <div className="flex items-start gap-3">
                      <CalendarIcon size={16} />
                      <div>
                        <p className="text-sm font-medium">Policy Period</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(policy.policy_period.effective_date)} -{' '}
                          {formatDate(policy.policy_period.expiration_date)}
                        </p>
                      </div>
                    </div>

                    {/* Premium */}
                    <div className="flex items-start gap-3">
                      <DollarSignIcon size={16} />
                      <div>
                        <p className="text-sm font-medium">Annual Premium</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(policy.premium.annual_total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Coverage Limits */}
                  <div className="flex items-start gap-3">
                    <ShieldIcon size={16} />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">
                        Coverage Limits
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                        {policy.coverages.dwelling && (
                          <div>
                            <span className="text-muted-foreground">
                              Dwelling:
                            </span>
                            <span className="ml-1">
                              {formatCurrency(policy.coverages.dwelling.limit)}
                            </span>
                          </div>
                        )}
                        {policy.coverages.personal_property && (
                          <div>
                            <span className="text-muted-foreground">
                              Personal Property:
                            </span>
                            <span className="ml-1">
                              {formatCurrency(
                                policy.coverages.personal_property.limit,
                              )}
                            </span>
                          </div>
                        )}
                        {policy.coverages.personal_liability && (
                          <div>
                            <span className="text-muted-foreground">
                              Liability:
                            </span>
                            <span className="ml-1">
                              {formatCurrency(
                                policy.coverages.personal_liability.limit,
                              )}
                            </span>
                          </div>
                        )}
                        {policy.coverages.medical_payments && (
                          <div>
                            <span className="text-muted-foreground">
                              Medical Payments:
                            </span>
                            <span className="ml-1">
                              {formatCurrency(
                                policy.coverages.medical_payments.limit,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deductibles */}
                  {policy.deductibles && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">Deductibles</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {policy.deductibles.amount && (
                            <div>
                              <span className="text-muted-foreground">
                                {policy.deductibles.type === 'flat'
                                  ? 'Flat Deductible'
                                  : 'Deductible'}
                                :
                              </span>
                              <span className="ml-1">
                                {formatCurrency(policy.deductibles.amount)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Policy Documents */}
                  {policy.documents && policy.documents.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Policy Documents
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {policy.documents.map((doc) => (
                            <Button
                              key={`${doc.type}-${doc.filename}`}
                              variant="outline"
                              size="sm"
                              className="w-full justify-between text-xs sm:text-sm"
                              onClick={() =>
                                openPolicyDocument(doc.storage_path)
                              }
                            >
                              <span className="flex items-center gap-2 truncate">
                                <FileTextIcon size={12} />
                                <span className="truncate">
                                  {doc.filename || `${doc.type} Document`}
                                </span>
                              </span>
                              <ExternalLinkIcon size={12} />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
