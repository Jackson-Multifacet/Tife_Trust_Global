import { motion, AnimatePresence } from "framer-motion"
import { useLoading } from "@/context/LoadingContext"

export function GlobalLoading() {
  const { isLoading } = useLoading()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-primary/20 overflow-hidden"
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            style={{ width: "40%" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
