"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { useSubscriptionModal } from "@/features/subscriptions/store/use-subscription-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SubscriptionModal = () => {
  const { isOpen, onClose } = useSubscriptionModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative h-[200px] w-full rounded-3xl p-4">
          <Image
            src="/images/subscription-hero.jpeg"
            alt="Subscription hero"
            fill
            className="m-4 object-cover"
            priority
          />
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Unlock Premium Features
            </DialogTitle>
            <DialogDescription className="text-center">
              Take your creativity to the next level
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">AI Image Generation</p>
                  <p className="text-sm text-muted-foreground">
                    Create unique images with AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Background Removal</p>
                  <p className="text-sm text-muted-foreground">
                    Remove backgrounds instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Premium Templates</p>
                  <p className="text-sm text-muted-foreground">
                    Access all premium templates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Link href="/billing" className="w-full">
              <Button size="lg" className="w-full" onClick={onClose}>
                Upgrade Now
              </Button>
            </Link>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
