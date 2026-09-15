import clsx from 'clsx';
import { useNavigate } from 'react-router';

import { ERROR_MESSAGES_CONFIG } from '@/lib/constants/components';

import Button from '../buttons/Button';
import ButtonLink from '../buttons/ButtonLink';
import Icon from '../icons/Icon';

interface ErrorProps {
  type: keyof typeof ERROR_MESSAGES_CONFIG;
  page?: 'inner' | 'outer';
  // Offers a full page reload, for failures a re-render can't fix, such as a
  // page chunk that failed to download.
  withReload?: boolean;
}

export default function ErrorState({
  type,
  page = 'inner',
  withReload = false,
}: ErrorProps) {
  const navigate = useNavigate();

  return (
    <figure
      className={clsx(
        'flex flex-col items-center justify-center gap-8',
        `${page === 'inner' ? 'mt-12' : ''}`,
      )}
    >
      <img
        className="h-75 w-75"
        alt="Error"
        src={`/error-${ERROR_MESSAGES_CONFIG[type].code}.png`}
        width={300}
        height={300}
        loading="eager"
      />
      <figcaption className="mt-4 text-center">
        <h2 className="text-3xl leading-snug font-bold tracking-wider">
          {ERROR_MESSAGES_CONFIG[type].header}
        </h2>
        <p className="mt-3 leading-snug font-light">
          {ERROR_MESSAGES_CONFIG[type].message}
        </p>
      </figcaption>
      {(page === 'outer' || withReload) && (
        <div className="flex gap-4">
          {withReload && (
            <Button
              size="lg"
              color={page === 'outer' ? 'outline' : 'blue'}
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          )}
          {page === 'outer' && (
            <>
              <ButtonLink iconName="utility" color="blue" href="/dashboard">
                Back to Home
              </ButtonLink>
              <Button size="lg" color="outline" onClick={() => navigate(-1)}>
                <Icon name="arrow-left" size={18} />
                Go Back
              </Button>
            </>
          )}
        </div>
      )}
    </figure>
  );
}
