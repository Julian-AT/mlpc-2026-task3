import { cn } from "@/lib/utils";

export function IconChevronLeft({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

export function IconChevronRight({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
