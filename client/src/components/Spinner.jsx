export default function Spinner({ size = "md", light = false }) {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-[3px]", lg: "h-12 w-12 border-4" };
  return (
    <div
      className={`${sizes[size]} rounded-full border-solid border-transparent animate-spin ${
        light ? "border-white border-t-white/60" : "border-primary border-t-primary/30"
      }`}
    />
  );
}