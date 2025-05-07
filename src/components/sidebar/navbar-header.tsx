import { ModeToggle } from "../mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export function NavbarHeader() {
  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-2">
        <SidebarTrigger className="-ml-1 md:-ml-2" />
        <div className="absolute pr-2 right-0">
          <ModeToggle />
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Mais opções aqui em breve...
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>iCorte™</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}