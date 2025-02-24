import { PlanSummary } from "@/features/subscriptions/components/plan-summary";
import React from "react";

const BillingPage = async () => {
  return (
    <section className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <div className="grid gap-10">
        <PlanSummary />
      </div>
    </section>
  );
};

export default BillingPage;
