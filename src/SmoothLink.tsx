import { useEffect } from "react";

export const SmoothLink = ({
  href,
  children,
}: {
  href: string;
  children: string | JSX.Element | JSX.Element[];
}) => {
  const target = document.querySelector(href);

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (!target) return;

        window.scrollTo({
          top:
            target.getBoundingClientRect().top +
            document.documentElement.scrollTop -
            (document.getElementById("header")?.offsetHeight || 0),
          left: 0,
          behavior: "smooth",
        });
      }}
    >
      {children}
    </a>
  );
};
