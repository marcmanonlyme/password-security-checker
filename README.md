# 🔒 Breach Lookup - Email Security Checker

A secure web application that checks if an email address has been compromised in known data breaches using the Have I Been Pwned (HIBP) API. Built with Azure Static Web Apps and Azure Functions.

## 🧪 Testing Without API Key

**Good news!** You can test the app immediately without purchasing an API key:

### **Demo Mode Features:**
- ✅ **Fully functional UI** - Test all frontend features
- ✅ **Mock breach data** - Realistic sample responses
- ✅ **Three test scenarios** - Safe, single breach, multiple breaches
- ✅ **No API key required** - Works out of the box

### **Demo Test Emails:**
| Email | Result | Description |
|-------|--------|-------------|
| `demo@example.com` | ⚠️ Breach Found | Shows Adobe breach (sample data) |
| `multiple@example.com` | ⚠️ Multiple Breaches | Shows Adobe, LinkedIn, Dropbox breaches |
| `safe@example.com` | ✅ No Breaches | Clean email address |
| `test@example.com` | ✅ No Breaches | Clean email address |

### **Real HIBP Test Accounts (FREE):**
Have I Been Pwned also provides free test accounts:
- `account-exists@hibp-integration-tests.com` - Returns real breaches
- `multiple-breaches@hibp-integration-tests.com` - Returns 3 real breaches
- `not-active-breach@hibp-integration-tests.com` - Returns no breaches

### **Upgrading to Production:**
1. Get API key from [haveibeenpwned.com/API/Key](https://haveibeenpwned.com/API/Key) (~$3.50/month)
2. Replace `HIBP_API_KEY` environment variable with your real key
3. App automatically switches from demo mode to live data

## 🌟 Features

- **Clean, responsive UI** - Modern design that works on all devices
- **Secure API integration** - Azure Function acts as a proxy to hide API keys
- **Real-time breach checking** - Uses the latest HIBP database
- **Detailed breach information** - Shows breach names, dates, and descriptions
- **Error handling** - Graceful handling of network issues and rate limits
- **No client-side secrets** - API key is securely stored in Azure environment variables

## 🏗️ Architecture

```
Frontend (Static Web App)
├── index.html - Main HTML structure
├── style.css - Responsive styling
├── script.js - Client-side logic
└── staticwebapp.config.json - Azure SWA configuration

Backend (Azure Functions)
├── api/
│   ├── check-breach.js - HTTP trigger function
│   └── package.json - Function dependencies
└── host.json - Functions runtime configuration
```

## 📋 Prerequisites

1. **Azure Account** - [Create free account](https://azure.microsoft.com/free/)
2. **Have I Been Pwned API Key** - [Get API key](https://haveibeenpwned.com/API/Key)
3. **Git** - For version control
4. **Node.js** (optional) - For local testing
5. **Azure CLI** (optional) - For command-line deployment

## 🚀 Quick Deployment

### Method 1: GitHub Integration (Recommended)

1. **Fork/Clone this repository** to your GitHub account

2. **Get HIBP API Key**:
   - Visit [haveibeenpwned.com/API/Key](https://haveibeenpwned.com/API/Key)
   - Purchase an API key ($3.50/month as of 2025)

3. **Deploy to Azure**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Create new "Static Web App" resource
   - Connect to your GitHub repository
   - Set build configuration:
     - App location: `/`
     - API location: `api`
     - Output location: `/`

4. **Configure Environment Variables**:
   - In Azure Portal, go to your Static Web App
   - Navigate to "Configuration" → "Application settings"
   - Add: `HIBP_API_KEY` = `your-actual-api-key`

5. **Deploy**: GitHub Actions will automatically build and deploy your app

### Method 2: Azure CLI Deployment

```powershell
# Login to Azure
az login

# Create resource group
az group create --name breach-lookup-rg --location eastus

# Create Static Web App
az staticwebapp create `
  --name breach-lookup-app `
  --resource-group breach-lookup-rg `
  --source https://github.com/yourusername/breach-lookup `
  --location eastus2 `
  --branch main `
  --app-location "/" `
  --api-location "api" `
  --output-location "/"

# Set environment variable
az staticwebapp appsettings set `
  --name breach-lookup-app `
  --setting-names HIBP_API_KEY=your-actual-api-key
```

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- [Azure Static Web Apps CLI](https://docs.microsoft.com/azure/static-web-apps/local-development)

### Setup

1. **Clone the repository**:
```powershell
git clone https://github.com/yourusername/breach-lookup.git
cd breach-lookup
```

2. **Install Function dependencies**:
```powershell
cd api
npm install
cd ..
```

3. **Create local settings file** (`api/local.settings.json`):
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "HIBP_API_KEY": "your-actual-api-key-here"
  }
}
```

4. **Start local development server**:
```powershell
# Install SWA CLI globally if not already installed
npm install -g @azure/static-web-apps-cli

# Start the application
swa start . --api-location ./api
```

5. **Open browser** to `http://localhost:4280`

## 🔐 Security Features

- **API Key Protection**: Never exposed to client-side code
- **CORS Configuration**: Properly configured for security
- **Input Validation**: Both client and server-side validation
- **Error Handling**: No sensitive information leaked in errors
- **Rate Limiting**: Handles HIBP API rate limits gracefully

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HIBP_API_KEY` | Your Have I Been Pwned API key | Yes |

### Static Web App Settings

The `staticwebapp.config.json` file configures:
- API route permissions
- Navigation fallback for SPA
- MIME type mappings

## 🚨 Troubleshooting

### Common Issues

**1. "Server configuration error"**
- ✅ Ensure `HIBP_API_KEY` is set in Azure app settings
- ✅ Wait a few minutes after setting environment variables

**2. API calls failing locally**
- ✅ Check `api/local.settings.json` exists with correct API key
- ✅ Verify Azure Functions Core Tools is installed

**3. CORS errors**
- ✅ Ensure you're using the SWA CLI for local development
- ✅ Check that API functions have proper CORS headers

**4. "Rate limit exceeded"**
- ✅ HIBP API has rate limits - wait and retry
- ✅ Consider implementing caching for production use

### Debug Mode

Enable detailed logging by adding to `host.json`:
```json
{
  "logging": {
    "logLevel": {
      "default": "Debug"
    }
  }
}
```

## 💡 API Usage

The Azure Function exposes one endpoint:

### GET `/api/check-breach`

**Parameters:**
- `email` (required) - Email address to check

**Response:**
```json
{
  "breached": true,
  "breaches": [
    {
      "Name": "Adobe",
      "BreachDate": "2013-10-04",
      "Description": "In October 2013, 153 million Adobe accounts were breached..."
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Invalid email format",
  "breached": false,
  "breaches": []
}
```

## 📈 Monitoring & Analytics

Azure Static Web Apps provides built-in monitoring:
- **Application Insights** - Automatic performance monitoring
- **Function Logs** - Available in Azure Portal
- **GitHub Actions** - Build and deployment logs

## 💰 Cost Estimation

- **Azure Static Web Apps**: Free tier available (100GB bandwidth/month)
- **Azure Functions**: Consumption plan ~$0.20/million executions
- **HIBP API**: $3.50/month (as of 2025)

**Total estimated monthly cost for typical usage: ~$4-10**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This application is for educational and informational purposes. Always verify security findings through official sources. The developers are not responsible for any security decisions made based on this tool's output.

## 🔗 Useful Links

- [Have I Been Pwned API Documentation](https://haveibeenpwned.com/API/v3)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Report Issues](https://github.com/yourusername/breach-lookup/issues)

---

**Built with ❤️ using Azure Static Web Apps + Azure Functions**
