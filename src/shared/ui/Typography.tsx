import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const typographyVariants = cva("font-[Pretendard] m-0 tracking-[0%]", {
  variants: {
    variant: {
      display: "text-[26px] leading-[140%] font-semibold",
      headline: "text-[24px] leading-[30px] font-medium",
      bodyLarge: "text-[18px] leading-[24px] font-medium",
      body: "text-[17px] leading-[24px] font-medium",
      subtext: "text-[14px] leading-[20px] font-medium",
      caption: "text-[12px] leading-[16px] font-medium",
    },
    color: {
      default: "text-[var(--color-text-default)]",
      subtle: "text-[var(--color-text-subtle)]",
      brand: "text-[var(--color-text-brand-default)]",
      white: "text-white",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
  },
});

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

const TypographyComponent = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, children, as, ...props }, ref) => {
    const Component = as || getDefaultElement(variant || "body");

    return (
      <Component
        className={cn(typographyVariants({ variant, color }), className)}
        ref={ref as any}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

TypographyComponent.displayName = "Typography";

type TypographyWithSubComponents = typeof TypographyComponent & {
  Display: typeof Display;
  Headline: typeof Headline;
  BodyLarge: typeof BodyLarge;
  Body: typeof Body;
  Subtext: typeof Subtext;
  Caption: typeof Caption;
};

const Typography = TypographyComponent as TypographyWithSubComponents;

function getDefaultElement(
  variant: string
): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" {
  switch (variant) {
    case "display":
      return "h1";
    case "headline":
      return "h2";
    case "bodyLarge":
    case "body":
      return "p";
    case "subtext":
    case "caption":
      return "span";
    default:
      return "p";
  }
}

const Display = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <TypographyComponent ref={ref} variant="display" {...props} />
);
Display.displayName = "Typography.Display";

const Headline = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => (
    <TypographyComponent ref={ref} variant="headline" {...props} />
  )
);
Headline.displayName = "Typography.Headline";

const BodyLarge = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => (
    <TypographyComponent ref={ref} variant="bodyLarge" {...props} />
  )
);
BodyLarge.displayName = "Typography.BodyLarge";

const Body = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <TypographyComponent ref={ref} variant="body" {...props} />
);
Body.displayName = "Typography.Body";

const Subtext = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <TypographyComponent ref={ref} variant="subtext" {...props} />
);
Subtext.displayName = "Typography.Subtext";

const Caption = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <TypographyComponent ref={ref} variant="caption" {...props} />
);
Caption.displayName = "Typography.Caption";

Typography.Display = Display;
Typography.Headline = Headline;
Typography.BodyLarge = BodyLarge;
Typography.Body = Body;
Typography.Subtext = Subtext;
Typography.Caption = Caption;

export { Typography, typographyVariants };
