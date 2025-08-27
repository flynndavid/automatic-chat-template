# Contributing to Automatic Chat Template

Thank you for your interest in contributing to the Automatic Chat Template! This document provides guidelines and information for contributors.

## 🎯 Types of Contributions

We welcome several types of contributions:

- **🐛 Bug fixes** - Help us fix issues and improve stability
- **✨ New features** - Add functionality that benefits template users
- **📚 Documentation** - Improve guides, examples, and clarity
- **🔧 Developer experience** - Improve setup, tooling, and workflows
- **🎨 UI/UX improvements** - Enhance the user interface and experience
- **⚡ Performance** - Optimize speed, bundle size, and efficiency

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Docker Desktop (for local Supabase)
- Git

### Setup Development Environment

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/your-username/automatic-chat-template.git
   cd automatic-chat-template
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment**:

   ```bash
   cp .env.local.example .env.local
   # Add your API keys and configuration
   ```

4. **Start local Supabase**:

   ```bash
   pnpm supabase:start
   ```

5. **Run the development server**:
   ```bash
   pnpm dev
   ```

### Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**:
   - Write clean, well-documented code
   - Follow existing code style and patterns
   - Add tests for new functionality

3. **Test your changes**:

   ```bash
   pnpm lint      # Check code style
   pnpm build     # Test build process
   pnpm test      # Run automated tests
   ```

4. **Commit and push**:

   ```bash
   git add .
   git commit -m "feat: add new feature" # Use conventional commits
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**:
   - Use the provided PR template
   - Describe your changes clearly
   - Link related issues

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing patterns and naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Components

- Use functional components with hooks
- Follow the established component structure
- Use proper TypeScript types for props
- Keep components focused and reusable

### CSS/Styling

- Use Tailwind CSS classes consistently
- Follow the existing design system
- Ensure responsive design works properly
- Test in both light and dark modes

### Database/Schema

- Use Drizzle ORM patterns
- Include proper migrations
- Add appropriate indexes
- Document schema changes

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for utility functions
- Test error handling and edge cases
- Mock external dependencies appropriately

### Integration Tests

- Use Playwright for E2E tests
- Test critical user flows
- Include both authenticated and unauthenticated scenarios

### Manual Testing

- Test in both local and hosted Supabase environments
- Verify different AI providers work
- Check responsive design
- Test with realistic data

## 📖 Documentation Guidelines

### Code Documentation

- Add JSDoc comments for functions and components
- Document complex logic and business rules
- Include usage examples for utilities

### User Documentation

- Update relevant documentation in `docs/`
- Include step-by-step instructions
- Add screenshots or examples where helpful
- Keep language clear and beginner-friendly

### Changelog

- Update CHANGELOG.md for significant changes
- Follow semantic versioning principles
- Include migration notes for breaking changes

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] Documentation is updated
- [ ] Self-review completed
- [ ] Related issues are linked

### PR Description

Use the provided template and include:

- Clear description of changes
- Screenshots/GIFs for UI changes
- Testing instructions
- Breaking change notes (if any)

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** in review environment
4. **Approval** and merge by maintainers

## 🐛 Reporting Bugs

### Before Reporting

- Search existing issues
- Check documentation
- Try with latest version
- Test in clean environment

### Bug Report Information

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error messages or screenshots
- Minimal reproduction case

## 💡 Suggesting Features

### Feature Request Guidelines

- Check existing feature requests
- Describe the problem it solves
- Propose specific solutions
- Consider implementation complexity
- Think about template user benefits

### Discussion Process

1. Open a feature request issue
2. Community discussion
3. Maintainer evaluation
4. Implementation planning (if approved)

## 🏆 Recognition

Contributors are recognized in:

- Repository contributors list
- Release notes (for significant contributions)
- Documentation credits
- Community showcases

## 📞 Getting Help

- **Discord/Slack**: Join our community chat
- **GitHub Discussions**: For general questions
- **Issues**: For bugs and feature requests
- **Documentation**: Check the `docs/` directory

## 📜 Code of Conduct

This project follows a Code of Conduct. By participating, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🙏 Thank You

Thank you for contributing to the Automatic Chat Template! Your efforts help make this project better for everyone in the community.

---

**Questions?** Don't hesitate to ask in GitHub Discussions or open an issue.
