export default function UIIcon({
  iconName,
  className,
}: {
  iconName: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${
        className ? ` ${className}` : ""
      }`}
    >
      {iconName}
    </span>
  );
}
