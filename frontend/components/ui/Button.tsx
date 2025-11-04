interface ButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  children: string;
  className?: string;
}
const Button = ({ children, className }: ButtonProps) => {
  return (
    <button
      className={`p-4 rounded text-center bg-violet-800 hover:bg-violet-600 cursor-pointer mt-4 mb-4 transition ${
        className ?? ""
      }`}
    >
      {children}
    </button>
  );
};
export default Button;
