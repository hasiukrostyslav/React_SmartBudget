import Icon from './Icon';

interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-md bg-red-500/20 px-3 py-2.5 text-red-500">
      <Icon name="triangle-alert" size={16} />
      <span className="text-xs">{message}</span>
    </div>
  );
}
