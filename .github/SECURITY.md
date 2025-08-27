# Security Policy

## Supported Versions

We actively support the following versions of the Automatic Chat Template:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability within this template, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Send a Private Report

Instead, please send an email to the repository maintainers with:

- **Subject Line**: `[SECURITY] Vulnerability Report - Automatic Chat Template`
- **Description**: A clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact Assessment**: Your assessment of the potential impact
- **Suggested Fix**: If you have suggestions for how to fix the issue

### 3. Response Timeline

- **Initial Response**: We aim to acknowledge your report within 48 hours
- **Investigation**: We will investigate and assess the vulnerability within 7 days
- **Resolution**: We will work on a fix and coordinate disclosure timing with you

## Security Best Practices

When using this template, please follow these security best practices:

### Environment Variables

- **Never commit** `.env.local` or any environment files containing secrets
- **Use strong secrets**: Generate secure random strings for `AUTH_SECRET`
- **Rotate API keys** regularly
- **Use environment-specific credentials** (separate keys for development/production)

### Database Security

- **Enable Row Level Security (RLS)** in Supabase (already configured in the template)
- **Use service role keys** only in secure server environments
- **Regularly update** your database credentials
- **Monitor database access** through Supabase dashboard

### Deployment Security

- **Use HTTPS** in production (automatically handled by Vercel)
- **Set secure headers** (configured in `next.config.ts`)
- **Enable CSRF protection** (built into Next.js)
- **Validate all inputs** on both client and server side

### API Security

- **Rate limiting**: Consider implementing rate limiting for production use
- **Input validation**: Always validate and sanitize user inputs
- **Authentication checks**: Verify user authentication for protected routes
- **CORS configuration**: Ensure CORS is properly configured for your domain

### Dependencies

- **Regular updates**: Keep dependencies up to date using `pnpm audit`
- **Security scanning**: Use automated security scanning in CI/CD
- **Minimal dependencies**: Only include necessary packages

## Known Security Considerations

### Template Defaults

This template includes some default configurations for development convenience:

1. **Local Supabase Keys**: The `.env.local.example` contains example keys for local development
2. **Development Secrets**: Some configurations are optimized for development, not production
3. **Example Data**: The template may include example data that should be removed in production

### Before Production Deployment

Before deploying to production:

1. **Generate new secrets**: Create new `AUTH_SECRET` and all API keys
2. **Review RLS policies**: Ensure database Row Level Security policies match your requirements
3. **Configure CORS**: Set appropriate CORS policies for your domain
4. **Remove debug code**: Remove any development-only code or logging
5. **Set up monitoring**: Implement proper logging and monitoring
6. **Security scan**: Run security scans on your deployed application

## Security Updates

We will:

- **Notify users** of security updates through GitHub releases
- **Provide patches** for supported versions when possible
- **Document security fixes** in release notes
- **Coordinate disclosure** responsibly with security researchers

## Additional Resources

- [Next.js Security Documentation](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Security Headers](https://vercel.com/docs/edge-network/headers)
- [OWASP Web Security](https://owasp.org/www-project-top-ten/)

---

Thank you for helping keep the Automatic Chat Template secure!
