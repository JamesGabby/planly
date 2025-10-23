import { Button } from "./ui/button";

const ITEMS_PER_PAGE = 6;

export function Pagination({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage = ITEMS_PER_PAGE,
}: {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(totalItems, currentPage * itemsPerPage);

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{totalItems}</span>
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
