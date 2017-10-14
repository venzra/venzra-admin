export const environment = {
    marketingPortal: process.env.MARKETING_URL || 'http://localhost:8080',
    managementPortal: process.env.ADMIN_URL || 'http://localhost:8181',
    replyEmail: `Venzra <${process.env.REPLY_TO || 'noreply@venzra.io'}>`,
    secure: process.env.NODE_ENV === 'PRODUCTION',
    secret: process.env.JWT_SECRET || 'venzra-development'
};
