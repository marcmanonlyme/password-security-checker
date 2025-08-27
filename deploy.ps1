# Azure Static Web Apps Direct Deployment Script
# Replace YOUR_DEPLOYMENT_TOKEN with the actual token from Azure Portal

Write-Host "🚀 Deploying Password Security Checker to Azure..." -ForegroundColor Green

# Set your deployment token here (get this from Azure Portal)
$deploymentToken = "f807024ab16e92c6eb5b2916eca327515a0cf65b632fd021bbc02cbd5d7994b002-ad5d344c-e7a9-42e6-a72f-b7d855791fae010163201f5e0e10"

if ($deploymentToken -eq "YOUR_DEPLOYMENT_TOKEN_HERE") {
    Write-Host "❌ Please set your deployment token in this script first!" -ForegroundColor Red
    Write-Host "Get your token from: Azure Portal > Static Web App > Manage deployment token" -ForegroundColor Yellow
    exit 1
}

# Deploy the application
npx @azure/static-web-apps-cli deploy . --api-location ./api --deployment-token $deploymentToken --env production

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Check your Azure Portal for the live URL" -ForegroundColor Cyan
