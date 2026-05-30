import Icon from '../../icons/Icon';
import IconColorful from '../../icons/IconColorful';

export default function TransactionAccount({
  paymentMethod,
}: {
  paymentMethod: string;
}) {
  return (
    <div className="flex items-center gap-2 px-1.5">
      {paymentMethod === 'Cash' ? (
        <Icon name="banknote" />
      ) : (
        <IconColorful name="Mastercard" className="w-8" />
      )}

      <span>{paymentMethod}</span>
    </div>
  );
}
