import { createLink, LinkComponent } from "@tanstack/react-router"
import { Button, ButtonProps } from "./ui/button"

const MyNavButton = (props: ButtonProps) => (
  <Button variant="outline" size="sm" role="link" {...props} />
)

const TanStackLinkComponent = createLink(MyNavButton)

export const TanStackLink: LinkComponent<typeof TanStackLinkComponent> = (props) => {
  return (
    <TanStackLinkComponent
      preload="intent"
      activeProps={{
        variant: 'default',
      }}
      {...props}
    />
  )
}