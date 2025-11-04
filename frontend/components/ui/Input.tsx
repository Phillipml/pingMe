export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`border-2 border-violet-600 rounded p-2 mb-2 ${className}`}
      {...props}
    />
  );
};

export default Input;
