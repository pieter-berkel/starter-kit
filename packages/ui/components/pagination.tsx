import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

function PaginationNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationButtonProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<typeof Button>;

function PaginationButton({ className, isActive, size = "icon", ...props }: PaginationButtonProps) {
  return (
    <Button
      {...(isActive ? { "aria-current": "page" } : {})}
      className={cn(className)}
      data-active={isActive}
      data-slot="pagination-button"
      size={size}
      variant={isActive ? "outline" : "ghost"}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to previous page"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      size="default"
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationButton>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to next page"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      size="default"
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationButton>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex size-9 items-center justify-center", className)}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

type PaginationProps = {
  count: number;
  defaultPage?: number;
  page?: number;
  onChange?: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  className?: string;
};

const usePagination = (props: PaginationProps) => {
  const {
    count,
    defaultPage = 0,
    page: pageProp,
    onChange,
    siblingCount = 1,
    boundaryCount = 1,
  } = props;

  const [pageState, setPageState] = useState(defaultPage);
  const page = pageProp ?? pageState;
  const displayPage = page + 1;

  const handleChange = (newDisplayPage: number) => {
    const newPage = newDisplayPage - 1;
    if (newPage < 0 || newPage >= count) {
      return;
    }
    if (pageProp === undefined) {
      setPageState(newPage);
    }
    onChange?.(newPage);
  };

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const displayPageForCalc = displayPage;
  const siblingsStart = Math.max(
    Math.min(displayPageForCalc - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(displayPageForCalc + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 && endPages[0] !== undefined ? endPages[0] - 2 : count - 1
  );

  const itemList: (number | "ellipsis")[] = [];

  itemList.push(...startPages);

  if (siblingsStart > boundaryCount + 2) {
    itemList.push("ellipsis");
  } else if (boundaryCount + 1 < count - boundaryCount) {
    itemList.push(boundaryCount + 1);
  }

  itemList.push(...range(siblingsStart, siblingsEnd));

  if (siblingsEnd < count - boundaryCount - 1) {
    itemList.push("ellipsis");
  } else if (count - boundaryCount > boundaryCount) {
    itemList.push(count - boundaryCount);
  }

  itemList.push(...endPages);

  return {
    page,
    displayPage,
    handleChange,
    itemList,
  };
};

function Pagination({
  count,
  defaultPage,
  page,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  className,
}: PaginationProps) {
  const {
    page: currentPage,
    displayPage,
    handleChange,
    itemList,
  } = usePagination({
    count,
    defaultPage,
    page,
    onChange,
    siblingCount,
    boundaryCount,
  });

  return (
    <PaginationNav className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 0}
            onClick={() => handleChange(displayPage - 1)}
          />
        </PaginationItem>
        {itemList.map((item, index) => (
          <PaginationItem key={item === "ellipsis" ? `ellipsis-${index}` : `page-${item}`}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationButton isActive={displayPage === item} onClick={() => handleChange(item)}>
                {item}
              </PaginationButton>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage === count - 1}
            onClick={() => handleChange(displayPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationNav>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationButton,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
