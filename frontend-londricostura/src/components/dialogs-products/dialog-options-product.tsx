'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import DialogEditProduct from '@/components/dialogs-products/dialog-edit-product';
import DialogRemoveProduct from '@/components/dialogs-products/dialog-remove-product';
import DialogDetailsProduct from '@/components/dialogs-products/dialog-details-product';
import { Product } from '@/interfaces/product';

interface DialogOptionsProductsProps {
  product: Product;
  onProductsChanged: () => void;
}

export default function DialogOptionsProducts({
  product,
  onProductsChanged,
}: DialogOptionsProductsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" className="flex flex-col w-70">

        <DropdownMenuItem asChild>
          <DialogEditProduct product={product} onProductsChanged={onProductsChanged} />
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DialogRemoveProduct product={product} onProductsChanged={onProductsChanged} />
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DialogDetailsProduct product={product} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
