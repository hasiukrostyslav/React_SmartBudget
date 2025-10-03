import Icon from './Icon';

const messageTypes = {
  signUp: {
    heading: 'Thanks for registration!',
    text: 'Your account has been created!',
  },
  login: {
    heading: 'Logged in successfully!',
    text: 'You are now ready to use SmartBudget!',
  },
};

const colorTypes = {
  success: {
    bgIcon: 'bg-linear-to-b from-green-400 from-30% to-emerald-600',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
  },
  error: {
    bgIcon: 'bg-linear-to-b from-red-400 from-30% to-red-500',
    border: 'border-red-300',
    bg: 'bg-red-50',
  },
  info: {
    bgIcon: 'bg-linear-to-b from-blue-400 from-30% to-blue-600',
    border: 'border-blue-400',
    bg: 'bg-blue-50',
  },
  warning: {
    bgIcon: 'bg-linear-to-b from-amber-400 from-30% to-amber-600',
    border: 'border-amber-400',
    bg: 'bg-amber-50',
  },
};

interface ToastProps {
  type: keyof typeof messageTypes;
  role: keyof typeof colorTypes;
}

export default function Toast({ type, role }: ToastProps) {
  return (
    <div
      className={`relative min-w-84 rounded-xl border-2 py-6 pl-12 ${colorTypes[role].bg} ${colorTypes[role].border}`}
    >
      <h3 className="mb-1 text-base font-semibold">
        {messageTypes[type].heading}
      </h3>
      <p className="text-xs font-normal">{messageTypes[type].text}</p>
      <span
        className={`absolute top-6 left-3 rounded-md p-0.5 ${colorTypes[role].bgIcon}`}
      >
        <Icon name={role} className="text-slate-50" />
      </span>
    </div>
  );
}
