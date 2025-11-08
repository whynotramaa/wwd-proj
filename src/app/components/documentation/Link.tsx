import { cx } from "lib/cx";

export const Link = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      className={cx(
        "text-primary underline underline-offset-2 hover:text-primary/80 hover:decoration-2 transition-colors",
        className
      )}
    >
      {children}
    </a>
  );
};
