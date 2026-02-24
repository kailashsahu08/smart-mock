export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/exams/:path*/test',
        '/results/:path*',
    ],
};
