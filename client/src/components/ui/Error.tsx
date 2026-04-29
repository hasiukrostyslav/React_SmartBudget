import { useNavigate } from 'react-router';
import { ERROR_MESSAGES } from '@/lib/constants/ui';
import Icon from './Icon';
import Button from './buttons/Button';
import ButtonLink from './buttons/ButtonLink';

interface ErrorProps {
  type: keyof typeof ERROR_MESSAGES;
}

export default function Error({ type }: ErrorProps) {
  const navigate = useNavigate();

  return (
    <figure className="flex flex-col items-center justify-center gap-8">
      <img
        className="h-[300px] w-[300px]"
        alt="Error"
        src={`/error-${ERROR_MESSAGES[type].code}.png`}
        width={300}
        height={300}
      />
      <figcaption className="mt-4 text-center">
        <h2 className="text-3xl leading-snug font-bold tracking-wider">
          {ERROR_MESSAGES[type].header}
        </h2>
        <p className="mt-3 leading-snug font-light">
          {ERROR_MESSAGES[type].message}
        </p>
      </figcaption>
      <div className="flex gap-4">
        <ButtonLink iconName="utility" color="blue" href="/">
          Back to Home
        </ButtonLink>
        <Button size="lg" color="outline" onClick={() => navigate(-1)}>
          <Icon name="arrow-left" size={18} />
          Go Back
        </Button>
      </div>
    </figure>
  );
}
