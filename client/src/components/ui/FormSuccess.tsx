import Icon from './Icon';

interface FormSuccessProps {
  message: string;
}

export default function FormSuccess({ message }: FormSuccessProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-emerald-400/20 px-3 py-2.5 text-emerald-600">
      <Icon name="circle-check-big" size={16} />
      <span className="text-xs">{message}</span>
    </div>
  );
}
