import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type LoadingButtonProps = {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
} & HTMLMotionProps<"button">;

export default function LoadingButton({
  label,
  loading = false,
  loadingLabel,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={loading || props.disabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-5 w-5" />
          {loadingLabel || "Processing..."}
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}
