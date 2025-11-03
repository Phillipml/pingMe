import { GiEyestalk } from "react-icons/gi";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export const Logo = ({ 
  iconClassName = "text-white",
  textClassName = "text-white ml-2",
  showText = true,
  className = "",
  ...props 
}: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <GiEyestalk className={iconClassName} />
      {showText && <h2 className={textClassName}>PingMe</h2>}
    </div>
  );
};
