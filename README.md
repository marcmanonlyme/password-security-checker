# 🔐 Password Security Checker

A fun and educational web application that checks if your password has been compromised in data breaches, with hilarious security messages to make cybersecurity education more engaging!

## 🌟 Features

- **🔍 Password Security Checking**: Uses Have I Been Pwned's Pwned Passwords API
- **😄 Funny Security Messages**: Hilarious warnings based on compromise severity levels
- **🛡️ Privacy Protection**: Uses k-anonymity model - only sends first 5 characters of SHA-1 hash
- **👁️ Password Visibility Toggle**: Show/hide password as you type
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Fast & Free**: Client-side processing, no API keys required
- **🎯 Educational**: Real-time password strength analysis with improvement tips

## 🚀 Live Demo

**Live URL**: [https://lively-forest-0f871f210.2.azurestaticapps.net](https://lively-forest-0f871f210.2.azurestaticapps.net)

## 🎭 Sample Messages

### Critical Risk (100,000+ breaches)
- "🚨 This password is more popular than pizza! Time for a change!"
- "😱 Hackers probably have this password on their business cards!"
- "🎪 This password is so common, it should join the circus!"

### Safe Passwords
- "🦄 This password is rarer than finding a parking spot at the mall!"
- "🎉 Your password is like a unicorn - rare and magical!"
- "🚀 Your password is out of this world - literally no hacker has it!"

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Azure Functions v4 (Node.js)
- **Hosting**: Azure Static Web Apps
- **API**: Have I Been Pwned Pwned Passwords API
- **Security**: Web Crypto API for SHA-1 hashing
- **Deployment**: GitHub Actions CI/CD

## 🔒 Security & Privacy

- **K-Anonymity Protection**: Only the first 5 characters of your password's SHA-1 hash are sent to the API
- **Client-Side Processing**: Your actual password never leaves your browser
- **No Storage**: Passwords are not logged or stored anywhere
- **HTTPS**: All communication is encrypted

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+ 
- Azure Static Web Apps CLI

### Setup
```bash
# Clone the repository
git clone https://github.com/marcmanonlyme/password-security-checker.git
cd password-security-checker

# Install dependencies
cd api && npm install && cd ..

# Start local development server
npx @azure/static-web-apps-cli start . --api-location ./api --port 4285
```

Visit `http://localhost:4285` to view the app locally.

## 📦 Project Structure

```
├── index.html              # Main application page
├── style.css               # Clean, organized styles
├── script.js               # Password checking logic
├── api/                    # Azure Functions backend
│   ├── package.json        # API dependencies
│   ├── host.json          # Azure Functions configuration
│   └── index.js           # Functions entry point
├── images/                 # Logo and assets
├── .github/workflows/      # GitHub Actions deployment
└── staticwebapp.config.json # Azure Static Web Apps config
```

## 🚀 Deployment

The app is automatically deployed to Azure Static Web Apps via GitHub Actions when code is pushed to the main branch.

### Manual Deployment
```bash
# Build and deploy
git add .
git commit -m "Update app"
git push origin main
```

## 🎯 How It Works

1. **User enters password** in the secure input field
2. **SHA-1 hash generated** client-side using Web Crypto API  
3. **First 5 characters** of hash sent to Pwned Passwords API (k-anonymity)
4. **Response analyzed** to check if full hash exists in breach database
5. **Results displayed** with appropriate funny message and security tips

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Have I Been Pwned** for the amazing Pwned Passwords API
- **Troy Hunt** for making cybersecurity data accessible
- **Azure Static Web Apps** for seamless hosting and deployment
- **GitHub Actions** for automated CI/CD

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the live demo for expected behavior
- Review the development setup instructions

---

**Made with 💙 by Marcus** - Making cybersecurity education fun, one password at a time! 🔐😄
