import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only unmounts between tests on its own when test globals are
// enabled. They aren't (tests import what they use), so it's registered here.
afterEach(cleanup);
