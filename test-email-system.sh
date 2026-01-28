#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🎨 DesignForge AI - Email System Quick Test${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found!${NC}"
    echo "Please create .env.local with required API keys"
    exit 1
fi

# Check for RESEND_API_KEY
if ! grep -q "RESEND_API_KEY" .env.local; then
    echo -e "${YELLOW}⚠️  RESEND_API_KEY not found in .env.local${NC}"
    echo "Please add: RESEND_API_KEY=your_api_key"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

# Check if dev server is running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Dev server is running on port 3001${NC}"
else
    echo -e "${YELLOW}⚠️  Dev server not running${NC}"
    echo -e "Starting dev server..."
    npm run dev &
    sleep 5
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   📧 Email System Test Options${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Preview email design in browser"
echo "2. Send test email to zaridze2909@gmail.com"
echo "3. Open admin email panel"
echo "4. View documentation"
echo "5. Setup webhook with ngrok"
echo ""
read -p "Select option (1-5): " option

case $option in
    1)
        echo -e "${GREEN}Opening email preview...${NC}"
        open http://localhost:3001/api/preview-email
        ;;
    2)
        echo -e "${GREEN}Sending test email...${NC}"
        curl http://localhost:3001/api/test-email
        echo ""
        echo -e "${GREEN}✅ Check your inbox: zaridze2909@gmail.com${NC}"
        ;;
    3)
        echo -e "${GREEN}Opening admin email panel...${NC}"
        open http://localhost:3001/admin/emails
        ;;
    4)
        echo -e "${GREEN}Opening documentation...${NC}"
        open CUSTOM_WELCOME_EMAIL_COMPLETE.md
        ;;
    5)
        echo -e "${YELLOW}Setting up webhook with ngrok...${NC}"
        echo ""
        echo "1. Starting ngrok tunnel..."
        ngrok http 3001 &
        sleep 3
        echo ""
        echo -e "${GREEN}✅ Ngrok tunnel started${NC}"
        echo ""
        echo "2. Copy the HTTPS URL from ngrok"
        echo "3. Go to: https://dashboard.clerk.com/"
        echo "4. Select your app → Webhooks"
        echo "5. Add endpoint: https://YOUR-NGROK-URL/api/webhooks/clerk"
        echo "6. Select events: user.created, user.updated"
        echo ""
        echo -e "${BLUE}Press Enter when done...${NC}"
        read
        ;;
    *)
        echo -e "${YELLOW}Invalid option${NC}"
        ;;
esac

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✨ Quick Links${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Preview Email:    http://localhost:3001/api/preview-email"
echo "Test Email:       http://localhost:3001/api/test-email"
echo "Admin Panel:      http://localhost:3001/admin/emails"
echo "Clerk Dashboard:  https://dashboard.clerk.com/"
echo "Resend Dashboard: https://resend.com/emails"
echo ""
