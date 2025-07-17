
#!/bin/bash

# Setup Husky for pre-commit hooks
echo "Setting up Husky pre-commit hooks..."

# Install husky if not already installed
if ! command -v husky &> /dev/null; then
    echo "Installing Husky..."
    npm install --save-dev husky
fi

# Initialize husky
npx husky install

# Add pre-commit hook for contrast checking
npx husky add .husky/pre-commit "npm run contrast-check"

echo "✅ Husky pre-commit hook configured to run contrast checks"
echo "Run 'chmod +x scripts/setup-husky.sh' to make this script executable"
