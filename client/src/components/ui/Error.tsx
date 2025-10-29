import ButtonLink from './ButtonLink';

const errors = {
  auth: {
    code: 401,
    header: 'Unauthorize, please sign in!',
  },
  route: {
    code: 404,
    header: 'Oops! This page doesn’t exist!',
  },
  server: {
    code: 500,
    header: 'Internal server error',
  },
};

interface ErrorProps {
  type: keyof typeof errors;
}

export default function Error({ type }: ErrorProps) {
  return (
    <figure className="flex flex-col items-center justify-center gap-8">
      <img
        className="h-[350] w-[350]"
        alt="Error"
        src={`/error-${errors[type].code}.png`}
        width={350}
        height={350}
      />
      <figcaption className="mt-4 text-3xl leading-snug font-medium tracking-wider">
        {errors[type].header}
      </figcaption>
      <ButtonLink href="/">Back to Home</ButtonLink>
    </figure>
  );
}
