export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    generalboard: '/dashboard/generalboard',
    noticesboard: '/dashboard/noticesboard',
    fraudboard: '/dashboard/fraudboard',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
