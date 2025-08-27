const { app } = require('@azure/functions');

// Demo data for testing without API key
const demoBreaches = {
    'test@example.com': [],
    'safe@example.com': [],
    'demo@example.com': [
        {
            Name: "Adobe",
            Title: "Adobe", 
            Domain: "adobe.com",
            BreachDate: "2013-10-04",
            AddedDate: "2013-12-04T00:00:00Z",
            ModifiedDate: "2022-05-15T23:52:49Z",
            PwnCount: 152445165,
            Description: "In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, <em>encrypted</em> password and a password hint in plain text. The password cryptography was poorly done and many were quickly resolved back to plain text.",
            DataClasses: ["Email addresses", "Password hints", "Passwords", "Usernames"],
            IsVerified: true,
            IsFabricated: false,
            IsSensitive: false,
            IsRetired: false,
            IsSpamList: false,
            IsMalware: false,
            IsSubscriptionFree: false,
            LogoPath: "Adobe.png"
        }
    ],
    'multiple@example.com': [
        {
            Name: "Adobe",
            Title: "Adobe",
            Domain: "adobe.com", 
            BreachDate: "2013-10-04",
            Description: "Adobe breach with 153 million accounts compromised.",
            DataClasses: ["Email addresses", "Passwords", "Usernames"]
        },
        {
            Name: "LinkedIn",
            Title: "LinkedIn",
            Domain: "linkedin.com",
            BreachDate: "2012-05-05", 
            Description: "LinkedIn breach affecting 6.5 million user accounts.",
            DataClasses: ["Email addresses", "Passwords"]
        },
        {
            Name: "Dropbox",
            Title: "Dropbox", 
            Domain: "dropbox.com",
            BreachDate: "2012-07-01",
            Description: "Dropbox breach affecting 68 million user accounts.",
            DataClasses: ["Email addresses", "Passwords"]
        }
    ]
};

// Handle demo mode without API key
async function handleDemoMode(email, headers, context) {
    context.log(`Demo mode: checking email ${email}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerEmail = email.toLowerCase();
    const breaches = demoBreaches[lowerEmail] || [];
    
    if (breaches.length > 0) {
        return {
            status: 200,
            headers,
            body: JSON.stringify({
                breached: true,
                breaches: breaches,
                demo: true,
                message: "Demo mode - using sample data. Get a real API key from haveibeenpwned.com/API/Key"
            })
        };
    } else {
        return {
            status: 200,
            headers,
            body: JSON.stringify({
                breached: false,
                breaches: [],
                demo: true,
                message: "Demo mode - using sample data. Get a real API key from haveibeenpwned.com/API/Key"
            })
        };
    }
}

app.http('check-breach', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'check-breach',
    handler: async (request, context) => {
        context.log('Breach check request received');

        // Set CORS headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        try {
            // Get email from query parameters
            const email = request.query.get('email');
            
            if (!email) {
                return {
                    status: 400,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Email parameter is required',
                        breached: false,
                        breaches: []
                    })
                };
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    status: 400,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Invalid email format',
                        breached: false,
                        breaches: []
                    })
                };
            }

            // Get API key from environment variables
            const apiKey = process.env.HIBP_API_KEY;
            
            // Demo mode for testing without API key
            if (!apiKey || apiKey === 'demo' || apiKey === 'your-have-i-been-pwned-api-key-here') {
                context.log('Running in DEMO mode - using mock data');
                return await handleDemoMode(email, headers, context);
            }

            // Call Have I Been Pwned API
            const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`;
            
            context.log(`Calling HIBP API for email: ${email}`);
            
            const response = await fetch(hibpUrl, {
                method: 'GET',
                headers: {
                    'hibp-api-key': apiKey,
                    'User-Agent': 'BreachLookup-AzureFunction'
                }
            });

            if (response.status === 404) {
                // No breaches found
                return {
                    status: 200,
                    headers,
                    body: JSON.stringify({
                        breached: false,
                        breaches: []
                    })
                };
            }

            if (response.status === 429) {
                // Rate limited
                return {
                    status: 429,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Rate limit exceeded. Please try again later.',
                        breached: false,
                        breaches: []
                    })
                };
            }

            if (!response.ok) {
                context.log.error(`HIBP API error: ${response.status} ${response.statusText}`);
                return {
                    status: 500,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Failed to check breach status',
                        breached: false,
                        breaches: []
                    })
                };
            }

            const breaches = await response.json();
            
            return {
                status: 200,
                headers,
                body: JSON.stringify({
                    breached: true,
                    breaches: breaches
                })
            };

        } catch (error) {
            context.log.error('Error in check-breach function:', error);
            return {
                status: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    breached: false,
                    breaches: []
                })
            };
        }
    }
});
