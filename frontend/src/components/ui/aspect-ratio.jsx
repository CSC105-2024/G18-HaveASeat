import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * @param {React.ComponentProps<typeof import('@radix-ui/react-aspect-ratio').Root>} props
 * @returns {JSX.Element}
 */
function AspectRatio({
  ...props
}) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
