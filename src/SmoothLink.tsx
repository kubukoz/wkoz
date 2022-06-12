export const SmoothLink = ({
  href,
  children,
}: {
  href: string;
  children: string | JSX.Element | JSX.Element[];
}) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const top =
          target.getBoundingClientRect().top +
          document.documentElement.scrollTop -
          (document.getElementById("header")?.offsetHeight || 0) +
          // Adding 1 because browsers hate me
          1;

        window.scrollTo({
          top,
          left: 0,
          behavior: "smooth",
        });
      }}
    >
      {children}
    </a>
  );
};
