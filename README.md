# Consumer Durables Service Platform

AI-powered service management platform for consumer durables (AC, Washing Machine, Refrigerator, TV, Water Purifier) with Inya.ai integration.

## Features

- **Voice AI Integration**: Seamless integration with Inya.ai for phone call handling
- **Service Request Management**: Handles both service and installation requests
- **Smart Technician Matching**: Automatic technician assignment based on skills, location, and availability
- **Region Detection**: Pincode-based location mapping for service routing
- **Multi-appliance Support**: AC, Washing Machine, Refrigerator, TV, Water Purifier
- **Comprehensive Database**: 34+ technicians across 6 major Indian cities
- **API-First Design**: RESTful APIs for easy integration

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **External APIs**: Indian Postal Pincode API
- **Security**: Helmet, CORS protection
- **Deployment**: Render

## Environment Variables

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
NODE_ENV=production
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key
```

## API Endpoints

### Main Customer Intake
```
POST /api/customer-intake
Content-Type: application/json

Body: {
  "full_name": "Customer Name",
  "phone": "+91-9876543210",
  "email": "customer@email.com",
  "address_text": "Complete Address",
  "pincode": "560034",
  "request_type": "service|installation",
  "appliance_type": "ac|washing_machine|refrigerator|tv|water_purifier",
  "model": "Brand Model",
  "fault_symptoms": ["symptom1", "symptom2"],
  "preferred_time_slots": ["morning", "evening"]
}
```

### Health Check
```
GET /health
```

## Deployment

1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

## Database Schema

- **customers**: Customer information and contact details
- **technicians**: Service technicians with skills and coverage areas
- **tickets**: Service requests and installation bookings
- **appointments**: Scheduled technician visits
- **regions_mapping**: Pincode to region mapping
- **notifications**: SMS/Email notification tracking

## Usage with Inya.ai

1. Configure Inya.ai custom integration with deployed URL
2. Set up conversation flow to collect customer details
3. API automatically handles ticket creation and technician assignment
4. Customer receives confirmation via SMS/Email

## Support

For technical support and integration assistance, contact: [your-email@domain.com]