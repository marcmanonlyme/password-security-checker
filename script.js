// DOM elements
const passwordInput = document.getElementById('passwordInput');
const checkButton = document.getElementById('checkButton');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');
const results = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');

// Toggle password visibility
function togglePasswordVisibility() {
    const toggleBtn = document.getElementById('togglePassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
        toggleBtn.title = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
        toggleBtn.title = 'Show Password';
    }
}

// Check password function
async function checkPassword() {
    const password = passwordInput.value;
    
    // Validate password
    if (!password) {
        showError('Please enter a password to check');
        return;
    }
    
    if (password.length < 4) {
        showError('Password must be at least 4 characters long');
        return;
    }
    
    await performPasswordCheck(password);
}

// Test password function for demo buttons
function testPassword(password) {
    passwordInput.value = password;
    performPasswordCheck(password);
}

// Perform the actual password check
async function performPasswordCheck(password) {
    // Show loading state
    setLoadingState(true);
    
    try {
        // Generate SHA-1 hash of the password
        const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        
        // Get first 5 characters for k-anonymity
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);
        
        // Call Pwned Passwords API
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        
        // Parse response and check for our password
        const lines = data.split('\n');
        let found = false;
        let count = 0;
        
        for (const line of lines) {
            const [hashSuffix, occurrences] = line.trim().split(':');
            if (hashSuffix === suffix) {
                found = true;
                count = parseInt(occurrences);
                break;
            }
        }
        
        // Show results
        if (found) {
            showCompromised(count);
        } else {
            showSafe();
        }
        
        // Show security tips
        showSecurityTips(password);
        
    } catch (error) {
        console.error('Error checking password:', error);
        showError('Failed to check password security. Please try again later.');
    } finally {
        setLoadingState(false);
    }
}

// Set loading state
function setLoadingState(loading) {
    checkButton.disabled = loading;
    if (loading) {
        buttonText.textContent = 'Checking...';
        loadingSpinner.classList.remove('hidden');
    } else {
        buttonText.textContent = 'Check Password';
        loadingSpinner.classList.add('hidden');
    }
}

// Show compromised result
function showCompromised(count) {
    results.className = 'results danger';
    const severityLevel = getSeverityLevel(count);
    const severityText = getSeverityText(count);
    const funnyMessage = getFunnyMessage(count);
    
    resultsContent.innerHTML = `
        <h3>⚠️ Password Compromised!</h3>
        <div class="compromise-count count-${severityLevel}">
            <div class="count-number">${count.toLocaleString()}</div>
            <div class="count-label">times in data breaches</div>
            <div class="severity-badge">${severityText} RISK</div>
        </div>
        <div class="funny-message">
            <p style="font-size: 1.1em; margin: 1rem 0; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                ${funnyMessage}
            </p>
        </div>
        <p><strong>⚡ Action Required:</strong> This password has appeared in ${count.toLocaleString()} data breach${count > 1 ? 'es' : ''}. Change it immediately!</p>
        <div class="recommendations">
            <h4>🛡️ Recommendations:</h4>
            <ul>
                <li>Create a new, unique password</li>
                <li>Use a password manager</li>
                <li>Enable two-factor authentication</li>
                <li>Never reuse this password anywhere</li>
            </ul>
        </div>
    `;
    results.classList.remove('hidden');
}

// Show safe result
function showSafe() {
    results.className = 'results safe';
    const safeMessage = getSafeMessage();
    
    resultsContent.innerHTML = `
        <h3>✅ Password Not Found!</h3>
        <div class="safe-indicator">
            <div class="check-mark">✓</div>
            <div class="safe-text">Not in known breaches</div>
        </div>
        <div class="funny-message">
            <p style="font-size: 1.1em; margin: 1rem 0; padding: 1rem; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #17a2b8;">
                ${safeMessage}
            </p>
        </div>
        <p>Great! This password was not found in any known data breaches.</p>
        <div class="recommendations">
            <h4>🛡️ Keep Your Password Secure:</h4>
            <ul>
                <li>Don't share it with anyone</li>
                <li>Use it only on trusted sites</li>
                <li>Consider using a password manager</li>
                <li>Enable two-factor authentication when available</li>
            </ul>
        </div>
    `;
    results.classList.remove('hidden');
}

// Show security tips
function showSecurityTips(password) {
    const tips = analyzePassword(password);
    if (tips.length > 0) {
        const tipsContainer = document.createElement('div');
        tipsContainer.className = 'security-tips';
        tipsContainer.innerHTML = `
            <h4>💡 Password Strength Tips:</h4>
            <ul>
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
        resultsContent.appendChild(tipsContainer);
    }
}

// Show error
function showError(message) {
    results.className = 'results error';
    resultsContent.innerHTML = `
        <h3>❌ Error</h3>
        <p>${escapeHtml(message)}</p>
    `;
    results.classList.remove('hidden');
}

// Utility functions
function getSeverityLevel(count) {
    if (count > 100000) return 'critical';
    if (count > 10000) return 'high';
    if (count > 1000) return 'medium';
    return 'low';
}

function getSeverityText(count) {
    if (count > 100000) return 'CRITICAL';
    if (count > 10000) return 'HIGH';
    if (count > 1000) return 'MEDIUM';
    return 'LOW';
}

function getFunnyMessage(count) {
    if (count > 100000) {
        const messages = [
            "🚨 This password is more popular than pizza! Time for a change!",
            "😱 Hackers probably have this password on their business cards!",
            "🎪 This password is so common, it should join the circus!",
            "🏆 Congratulations! You've picked a password that's in the Hall of Shame!",
            "📢 This password is shouting 'HACK ME!' from the rooftops!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (count > 10000) {
        const messages = [
            "😬 This password has seen more action than a Hollywood stuntman!",
            "🎭 Your password is having an identity crisis - everyone knows it!",
            "🚪 This password opens more doors than a hotel master key!",
            "🎯 Hackers are using this password as target practice!",
            "🍕 This password is shared more than a pizza at a college party!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (count > 1000) {
        const messages = [
            "🤔 Your password is getting around more than a world traveler!",
            "📚 This password appears in more places than 'Where's Waldo?'",
            "🎪 Time to retire this password - it's done enough touring!",
            "🕵️ Even amateur detectives could crack this one!",
            "🎲 Rolling dice might give you better security than this!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Low severity (1-1000)
    const messages = [
        "😕 Your password has trust issues - it's been seen with hackers!",
        "🔍 This password needs witness protection!",
        "⚠️ Your password has been caught red-handed in data breaches!",
        "🚨 Time to break up with this password - it's been cheating!",
        "🎭 Your password is playing hard to get... but not hard enough!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function getSafeMessage() {
    const messages = [
        "🎉 Your password is like a unicorn - rare and magical!",
        "🥳 Congratulations! Your password passed the hacker test with flying colors!",
        "🌟 This password is cleaner than a freshly washed car!",
        "🎊 Your password is so unique, it deserves its own fan club!",
        "🦄 This password is rarer than finding a parking spot at the mall!",
        "🏆 Gold medal for password originality!",
        "🚀 Your password is out of this world - literally no hacker has it!",
        "💎 This password is a hidden gem in the security world!",
        "🎯 Bullseye! You've hit the password security jackpot!",
        "🛡️ Your password is wearing invisible armor - hackers can't see it!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function analyzePassword(password) {
    const tips = [];
    
    if (password.length < 12) {
        tips.push('Use at least 12 characters for better security');
    }
    
    if (!/[A-Z]/.test(password)) {
        tips.push('Add uppercase letters (A-Z)');
    }
    
    if (!/[a-z]/.test(password)) {
        tips.push('Add lowercase letters (a-z)');
    }
    
    if (!/[0-9]/.test(password)) {
        tips.push('Add numbers (0-9)');
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
        tips.push('Add special characters (!@#$%^&*)');
    }
    
    // Check for common patterns
    if (/123|abc|qwe|password|admin/i.test(password)) {
        tips.push('Avoid common patterns like "123", "abc", or "password"');
    }
    
    if (/(.)\1{2,}/.test(password)) {
        tips.push('Avoid repeating the same character multiple times');
    }
    
    return tips;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

passwordInput.addEventListener('input', function() {
    // Hide results when user starts typing
    if (!results.classList.contains('hidden')) {
        results.classList.add('hidden');
    }
});

// Focus on password input when page loads
window.addEventListener('load', function() {
    passwordInput.focus();
});
