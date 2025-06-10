
/**
 * @module components/ui/sidebar
 * Componente de Sidebar reutilizável e altamente configurável.
 *
 * Principal Responsabilidade:
 * Fornecer uma estrutura de sidebar flexível que pode ser usada de várias maneiras:
 * - Como uma sidebar tradicional fixa ou flutuante.
 * - Em modo "icon" (colapsada, mostrando apenas ícones).
 * - Como um "offcanvas" (desliza para fora da tela).
 * - Adaptável para dispositivos móveis (geralmente usando o modo offcanvas).
 *
 * Subcomponentes:
 * - `SidebarProvider`: Contexto para gerenciar o estado da sidebar (aberta/fechada, modo).
 * - `Sidebar`: O contêiner principal da sidebar.
 * - `SidebarTrigger`: Botão para alternar o estado da sidebar.
 * - `SidebarRail`: Barra lateral fina para alternar a sidebar quando colapsada.
 * - `SidebarInset`: Contêiner para o conteúdo principal da página, que se ajusta à sidebar.
 * - `SidebarHeader`, `SidebarFooter`, `SidebarContent`: Seções estruturais dentro da sidebar.
 * - `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`: Para agrupar itens.
 * - `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`: Para criar menus de navegação dentro da sidebar.
 * - `SidebarInput`, `SidebarSeparator`: Elementos de UI utilitários para a sidebar.
 *
 * Utiliza cookies para persistir o estado da sidebar entre as sessões (desktop) e atalhos de teclado.
 *
 * ```mermaid
 * graph LR
 *   App --> SidebarProvider_Context["SidebarProvider (Context)"]
 *   SidebarProvider_Context --> Sidebar_Comp["Sidebar"]
 *   SidebarProvider_Context --> SidebarInset_Comp["SidebarInset (Main Content Wrapper)"]
 *   App --> SidebarTrigger_Button["SidebarTrigger (Button)"]
 *
 *   Sidebar_Comp --> SidebarHeader_Sec["SidebarHeader"]
 *   Sidebar_Comp --> SidebarContent_Sec["SidebarContent (Scrollable)"]
 *   Sidebar_Comp --> SidebarFooter_Sec["SidebarFooter"]
 *
 *   SidebarContent_Sec --> SidebarGroup_Container["SidebarGroup"]
 *   SidebarGroup_Container --> SidebarGroupLabel_Text["SidebarGroupLabel"]
 *   SidebarGroup_Container --> SidebarMenu_List["SidebarMenu (ul)"]
 *
 *   SidebarMenu_List --> SidebarMenuItem_Item["SidebarMenuItem (li)"]
 *   SidebarMenuItem_Item --> SidebarMenuButton_Action["SidebarMenuButton (Button/Link)"]
 *   SidebarMenuItem_Item --> SidebarMenuAction_Opt["SidebarMenuAction (Optional Button)"]
 *   SidebarMenuItem_Item --> SidebarMenuBadge_Info["SidebarMenuBadge (Optional Info)"]
 *
 *   SidebarMenuButton_Action --> SidebarMenuSub_SubList["SidebarMenuSub (ul for dropdowns)"]
 *   SidebarMenuSub_SubList --> SidebarMenuSubItem_SubItem["SidebarMenuSubItem (li)"]
 *   SidebarMenuSubItem_SubItem --> SidebarMenuSubButton_SubAction["SidebarMenuSubButton (Button/Link)"]
 * ```
 *
 */
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const _SidebarContext = React.createContext<SidebarContext | null>(null)

/**
 * Hook para acessar o contexto da Sidebar.
 * Deve ser usado dentro de um `SidebarProvider`.
 * @returns {SidebarContext} O contexto da sidebar.
 * @throws {Error} Se usado fora de um `SidebarProvider`.
 */
export function useSidebar() {
  const context = React.useContext(_SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

/**
 * Provedor de contexto para o estado da sidebar.
 * Gerencia se a sidebar está aberta/fechada, tanto no desktop quanto no mobile,
 * e o estado colapsado/expandido.
 */
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    /** Estado de abertura padrão da sidebar no desktop. Padrão: `true`. */
    defaultOpen?: boolean
    /** Controla o estado de abertura da sidebar no desktop externamente. */
    open?: boolean
    /** Callback para quando o estado de abertura da sidebar no desktop muda. */
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <_SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </_SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

/**
 * Componente principal da Sidebar.
 * Renderiza a sidebar com base no estado do `SidebarProvider` e nas props de configuração.
 */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    /** Lado em que a sidebar aparecerá. Padrão: `"left"`. */
    side?: "left" | "right"
    /** Variante visual da sidebar. Padrão: `"sidebar"`.
     * - `"sidebar"`: Sidebar tradicional.
     * - `"floating"`: Sidebar flutuante com sombra e bordas.
     * - `"inset"`: Sidebar que se encaixa dentro de um layout principal (`SidebarInset`).
     */
    variant?: "sidebar" | "floating" | "inset"
    /** Comportamento de colapso da sidebar. Padrão: `"offcanvas"`.
     * - `"offcanvas"`: A sidebar desliza para fora da tela quando colapsada.
     * - `"icon"`: A sidebar encolhe para mostrar apenas ícones quando colapsada.
     * - `"none"`: A sidebar não é colapsável.
     */
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()


    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            {/* Adicionado SheetTitle para acessibilidade */}
            <SheetTitle className="sr-only">Navegação Principal</SheetTitle>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    // Logic for placeholder div classes
    const placeholderBaseClasses = "duration-200 relative h-svh transition-[width] ease-linear";
    let placeholderWidthClass = "";

    if (collapsible === "offcanvas") {
      placeholderWidthClass = "w-0"; // Offcanvas placeholder should ALWAYS be w-0, regardless of state.
    } else if (collapsible === "icon") {
      if (state === "collapsed") {
        placeholderWidthClass = (variant === "floating" || variant === "inset")
          ? "w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
          : "w-[--sidebar-width-icon]";
      } else { // state === "expanded"
        placeholderWidthClass = "w-[--sidebar-width]";
      }
    } else { // collapsible === "none" (already handled)
      placeholderWidthClass = "w-[--sidebar-width]";
    }

    // Determine placeholder background:
    // For offcanvas (expanded or collapsed), or icon (collapsed and inset/floating), it should match the main page background.
    // Otherwise, it matches the sidebar background.
    let placeholderBgClass = "bg-sidebar"; // Default
    if (collapsible === "offcanvas") {
      placeholderBgClass = "bg-background";
    } else if (collapsible === "icon" && state === "collapsed" && (variant === "floating" || variant === "inset")) {
      placeholderBgClass = "bg-background";
    }


    const placeholderDivClasses = cn(
      placeholderBaseClasses,
      placeholderWidthClass,
      placeholderBgClass,
      "group-data-[side=right]:rotate-180"
    );

    const sidebarDivClasses = cn(
      "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
      side === "left"
        ? (state === "collapsed" && collapsible === "offcanvas" ? "left-[calc(var(--sidebar-width)*-1)]" : "left-0")
        : (state === "collapsed" && collapsible === "offcanvas" ? "right-[calc(var(--sidebar-width)*-1)]" : "right-0"),
      collapsible === "icon" && state === "collapsed" && ((variant === "floating" || variant === "inset") ? "w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "w-[--sidebar-width-icon]"),
      variant !== "floating" && variant !== "inset" && (side === "left" ? "border-r" : "border-l"),
      className
    );

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={placeholderDivClasses}
        />
        <div
          className={sidebarDivClasses}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

/**
 * Botão para alternar o estado de visibilidade da sidebar.
 * Em modo mobile, abre/fecha a sidebar offcanvas.
 * Em modo desktop, colapsa/expande a sidebar.
 */
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, children, asChild, ...buttonSpecificProps }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      asChild={asChild}
      {...buttonSpecificProps}
    >
      {asChild && children ? (
        children
      ) : (
        <>
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

/**
 * Barra lateral fina ("rail") que aparece quando a sidebar está colapsada em modo "icon".
 * Permite ao usuário clicar para expandir a sidebar.
 */
const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

/**
 * Componente para envolver o conteúdo principal da página.
 * Ajusta sua margem e aparência com base no estado e variante da sidebar,
 * especialmente útil com a variante "inset".
 */
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

/**
 * Componente de Input estilizado para uso dentro da Sidebar.
 */
const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

/**
 * Contêiner para o cabeçalho da Sidebar.
 */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

/**
 * Contêiner para o rodapé da Sidebar.
 */
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

/**
 * Componente Separator estilizado para uso dentro da Sidebar.
 */
const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

/**
 * Contêiner para a área de conteúdo principal da Sidebar (geralmente rolável).
 */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

/**
 * Contêiner para agrupar logicamente itens dentro da Sidebar.
 */
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

/**
 * Rótulo para um `SidebarGroup`. Fica oculto quando a sidebar está em modo "icon".
 */
const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

/**
 * Botão de ação opcional para um `SidebarGroup` (e.g., um botão "+").
 * Fica oculto quando a sidebar está em modo "icon".
 */
const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

/**
 * Contêiner para o conteúdo de um `SidebarGroup`.
 */
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

/**
 * Lista `<ul>` para um menu dentro da Sidebar.
 */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

/**
 * Item `<li>` de um `SidebarMenu`.
 */
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Botão clicável dentro de um `SidebarMenuItem`.
 * Pode conter um ícone e texto. O texto é truncado quando a sidebar está em modo "icon".
 * Suporta um tooltip opcional que aparece quando a sidebar está em modo "icon".
 */
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    /** Indica se o item de menu está ativo. */
    isActive?: boolean
    /** Conteúdo do tooltip a ser exibido no modo "icon", ou um objeto de props para `TooltipContent`. */
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

/**
 * Botão de ação opcional para um `SidebarMenuItem` (e.g., um ícone de "mais opções").
 * Fica oculto quando a sidebar está em modo "icon".
 * Pode ser configurado para aparecer apenas no hover.
 */
const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    /** Se true, a ação só aparece quando o mouse está sobre o item de menu. */
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

/**
 * Badge opcional para um `SidebarMenuItem` (e.g., para contagens de notificações).
 * Fica oculto quando a sidebar está em modo "icon".
 */
const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

/**
 * Componente de esqueleto de carregamento para itens de menu.
 * Útil para indicar que o conteúdo do menu está sendo carregado.
 */
const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    /** Se true, mostra um esqueleto de ícone. */
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

/**
 * Lista `<ul>` para um submenu dentro de um `SidebarMenuButton` (geralmente usado com dropdowns ou accordions).
 * Fica oculto quando a sidebar está em modo "icon".
 */
const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

/**
 * Item `<li>` de um `SidebarMenuSub`.
 */
const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

/**
 * Botão clicável (ou link) dentro de um `SidebarMenuSubItem`.
 */
const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    /** Tamanho do botão do submenu. */
    size?: "sm" | "md"
    /** Indica se o item de submenu está ativo. */
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  // useSidebar, // A exportação de useSidebar já está acima com export type
}
// Já exportado como type mais acima
// export type { SidebarContext };
