export const environment = {
    marketingPortal: process.env.MARKETING_URL || 'http://localhost:8080',
    managementPortal: process.env.ADMIN_URL || 'http://localhost:8181',
    replyEmail: `Venzra <${process.env.REPLY_TO || 'noreply@venzra.io'}>`,
    secure: process.env.NODE_ENV === 'PRODUCTION',
    secret: process.env.JWT_SECRET || 'venzra-development',
    stripe: process.env.STRIPE_KEY || '',
    stripeWebhooks: process.env.STRIPE_WEBHOOK_KEY || '',
    stripeConnect: process.env.STRIPE_CONNECT_KEY || '',
    imageBucket: process.env.AWS_IMAGE_BUCKET || 'images.venza-test.com'
};
