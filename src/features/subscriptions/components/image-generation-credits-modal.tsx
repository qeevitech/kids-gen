"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useImageGenerationModal } from "@/features/subscriptions/store/use-image-generation-modal";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ImageGenerationModal = () => {
  const mutation = useCheckout();
  const { isOpen, onClose } = useImageGenerationModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex items-center space-y-4">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          <DialogTitle className="text-center">
            Upgrade to a paid plan
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to a paid plan to unlock more features
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ul className="space-y-2">
          <li className="flex items-center">
            <CheckCircle2 className="mr-2 size-5 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">Unlimited projects</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="mr-2 size-5 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">Unlimited templates</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="mr-2 size-5 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">
              AI Background removal
            </p>
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="mr-2 size-5 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">AI Image generation</p>
          </li>
        </ul>
        <DialogFooter className="mt-4 gap-y-2 pt-2">
          <Link href="/billing" className="w-full">
            <Button className="w-full" onClick={onClose}>
              Upgrade
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
