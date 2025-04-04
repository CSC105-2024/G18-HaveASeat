import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * @param {React.ComponentProps<typeof import('@radix-ui/react-collapsible').Root>} props
 * @returns {JSX.Element}
 */
function Collapsible({
  ...props
}) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * @param {React.ComponentProps<typeof import('@radix-ui/react-collapsible').CollapsibleTrigger>} props
 * @returns {JSX.Element}
 */
function CollapsibleTrigger({
  ...props
}) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * @param {React.ComponentProps<typeof import('@radix-ui/react-collapsible').CollapsibleContent>} props
 * @returns {JSX.Element}
 */
function CollapsibleContent({
  ...props
}) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
