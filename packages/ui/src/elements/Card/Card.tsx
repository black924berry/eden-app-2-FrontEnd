import clsx from "clsx";

export interface CardProps {
  children?: React.ReactNode;
  shadow?: boolean;
  border?: boolean;
  background?: boolean;
  focused?: boolean;
}

export const Card = ({
  children,
  shadow = false,
  border = false,
  background = false,
  focused = false,
}: CardProps) => {
  const cardCls = clsx("rounded-2xl p-6", {
    "shadow-lg": shadow === true,
    "border-soilGreen-600/60 border-2": border === true,
    "bg-soilGreen-600/30": background === true,
    "border-soilGreen-600 border-2": focused === true,
  });

  return <div className={cardCls}>{children}</div>;
};
