interface PremiumTitleProps {
  text: string;
  className?: string;
}

export default function PremiumTitle({ text, className }: PremiumTitleProps) {
  return (
    <h1
      className={
        "mb-4 text-xl font-semibold tracking-[0.14em] text-[#f6e3a4] " +
        "md:text-2xl md:mb-6 " +
        (className ?? "")
      }
    >
      {text}
    </h1>
  );
}
