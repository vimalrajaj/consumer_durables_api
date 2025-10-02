# Consumer Durables AI Agent - Inya.ai Challenge

## 1. Overview

This project implements an AI-powered voice agent for consumer durables service and installation management. The agent handles two primary flows: **Service Requests** (repairs) and **Installation** requests across dynamic appliance types including AC, Washing Machine, Refrigerator, Water Purifier, and TV.

### Key Features
- **Intelligent Voice Agent**: Built on Inya.ai platform for natural conversation
- **Appliance-Specific Triage**: Adaptive questioning based on appliance type and issue
- **Smart Technician Matching**: Assignment based on skills, coverage regions, and availability
- **Automated Notifications**: SMS and Email confirmations via Twilio and SendGrid
- **Complete Data Management**: Customer records, ticket tracking, and appointment scheduling
- **Production Ready**: Deployed on Render with Supabase database

## 2. Problem Statement Implementation

### ✅ Implemented Requirements
- **Intent Detection**: Service Request vs Installation at conversation start
- **Appliance-Specific Questions**: Detailed diagnostic questions for each appliance type
- **Technician Matching**: Skills-based assignment restricted to service regions
- **Data Validation**: Phone, email, address, pincode validation and persistence
- **Region Mapping**: Pincode to district/region lookup with fallback
- **Supportive Tone**: Calm, solution-oriented conversation throughout
- **Professional Scheduling**: Multiple slot proposals and confirmation

## 3. Architecture & Components

### Technology Stack
```
Frontend: Inya.ai Voice Agent
Backend: Node.js/Express API Server
Database: Supabase (PostgreSQL)
SMS: Twilio Integration
Email: SendGrid Integration
Hosting: Render Cloud Platform
```

### System Flow
```
Customer Call → Inya.ai Agent → API Processing → Database Storage
                    ↓
SMS + Email Notifications ← Technician Assignment ← Region Mapping
```

## 4. API Endpoints

### Base URL: `https://consumer-durables-api.onrender.com`

#### Main Endpoints:
- `GET /health` - Health check
- `POST /api/customer-intake` - Primary endpoint for service/installation requests
- `GET /api/ticket/:id` - Retrieve ticket status
- `POST /api/send-sms` - Send SMS notifications
- `POST /api/send-email` - Send email notifications
- `POST /api/send-notifications` - Send both SMS and email

### Customer Intake API Request Format:
```json
{
  "full_name": "John Doe",
  "phone": "+91-9876543210",
  "email": "john@example.com",
  "address_text": "123 MG Road, Bangalore",
  "pincode": "560001",
  "request_type": "service",
  "appliance_type": "ac",
  "model": "LG 1.5 Ton Split AC",
  "fault_symptoms": ["not_cooling", "unusual_noise"],
  "installation_details": [],
  "preferred_time_slots": ["morning", "afternoon"]
}
```

### API Response Format:
```json
{
  "success": true,
  "message": "Service request processed successfully",
  "data": {
    "customer_id": "uuid",
    "ticket_id": "uuid",
    "ticket_number": "TKT123456",
    "status": "created",
    "technician": {
      "name": "Raj Kumar",
      "phone": "+91-9876543210",
      "id": "tech_001"
    },
    "appointment": {
      "slot_start": "2025-10-03T10:00:00+05:30",
      "slot_end": "2025-10-03T12:00:00+05:30",
      "status": "scheduled"
    },
    "estimated_response_time": "Within 2 hours"
  }
}
```

## 5. Data Model

### Customer Entities
```json
{
  "full_name": "string",
  "phone": "string (+91 format)",
  "email": "string (validated)",
  "address_text": "string",
  "pincode": "string (6 digits)",
  "region_label": "string (derived from pincode)",
  "preferred_time_slots": ["morning", "afternoon", "evening"]
}
```

### Job Context
```json
{
  "request_type": "service|installation",
  "appliance_type": "ac|washing_machine|refrigerator|tv|water_purifier",
  "model": "string (optional)",
  "fault_symptoms": ["array of symptom strings"],
  "installation_details": ["array of requirement strings"],
  "urgency": "low|medium|high (auto-determined)"
}
```

### Technician Data Schema
```json
{
  "technicians": [
    {
      "id": "tech_001",
      "name": "Raj Kumar",
      "phone": "+91-9876543210",
      "email": "raj@techservice.com",
      "skills": ["ac_repair", "ac_installation", "cooling_systems"],
      "appliances_supported": ["ac", "refrigerator"],
      "regions": ["bengaluru_urban", "bangalore_rural"],
      "is_active": true,
      "availability_slots": [
        {
          "start": "2025-10-03T09:00:00+05:30",
          "end": "2025-10-03T17:00:00+05:30"
        }
      ]
    }
  ]
}
```

### Region Mapping
```json
{
  "regions": [
    {
      "pincode": "560001",
      "region_label": "Bengaluru Urban",
      "state": "Karnataka",
      "city": "Bangalore"
    },
    {
      "pincode": "400001", 
      "region_label": "Mumbai",
      "state": "Maharashtra",
      "city": "Mumbai"
    }
  ]
}
```

## 6. Appliance-Specific Diagnostic Questions

### AC Service Questions:
- Is your AC cooling properly or blowing warm air?
- Do you hear unusual noises (rattling, squeaking, grinding)?
- Is there water leakage from indoor/outdoor unit?
- Are there error codes or blinking lights?

### Washing Machine Service Questions:
- Is the drum spinning during wash/spin cycles?
- Excessive vibration or machine movement?
- Water intake or drainage problems?
- Error codes on display panel?
- Door/lid closing and locking properly?

### Refrigerator Service Questions:
- Cooling performance issues?
- Excessive frost buildup in freezer?
- Door sealing problems?
- Unusual noises (clicking, buzzing, humming)?
- Ice maker or water dispenser issues?

### TV Service Questions:
- Power on issues or no display?
- Picture problems (black screen, lines, distortion)?
- Sound issues (audio but no video, or vice versa)?
- Remote control functionality?
- Input port problems (HDMI, cable, streaming)?

### Water Purifier Service Questions:
- Reduced water flow rate?
- Unusual taste or smell in water?
- Filter change indicators?
- Unusual sounds during purification?
- Storage tank filling properly?

## 7. Pincode API Integration

### Endpoint Used:
`https://api.postalpincode.in/pincode/{PINCODE}`

### Region Label Extraction:
```javascript
// Extract District from response for region_label
const region_label = response[0]?.PostOffice?.[0]?.District || 'Unknown';
```

### Fallback Strategy:
If API fails, system uses cached region mapping based on pincode prefixes to ensure booking is not blocked.

## 8. Setup Instructions

### Prerequisites:
- Node.js version 16+
- Twilio account with SMS capability
- SendGrid account with verified sender
- Supabase project with PostgreSQL database

### Environment Variables:
Create `.env` file with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=your_verified_sender_email
PORT=3000
```

### Database Setup:
1. Run `node setup-database.js` to create tables
2. Run `node load-comprehensive-data.js` to load technician data

### Local Development:
```bash
npm install
npm start
```

### Production Deployment:
Deployed on Render with automatic deployments from GitHub repository.

## 9. Testing

### Phone Format Testing:
```bash
node test-phone-formats.js
```
Tests various phone number formats that Inya.ai might send.

### API Testing:
```bash
# Health Check
curl https://consumer-durables-api.onrender.com/health

# Customer Intake Test
curl -X POST https://consumer-durables-api.onrender.com/api/customer-intake \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","phone":"+91-9876543210","email":"test@example.com","request_type":"service","appliance_type":"ac","fault_symptoms":["not_cooling"]}'
```

## 10. Edge Cases Handled

### Invalid Pincode:
- System retries pincode API call once
- Falls back to cached region mapping
- Continues with booking process

### No Available Technician:
- Proposes alternative time slots
- Matches with nearest qualified technician
- Provides estimated wait time

### API Timeouts:
- Implements retry logic with exponential backoff
- Graceful degradation with cached data
- Clear error messages to customers

### Phone Number Formats:
- Handles various input formats (+91, with/without spaces, brackets)
- Normalizes to E.164 format for Twilio
- Validates 10-digit Indian mobile numbers

## 11. Inya.ai Integration

### System Prompt Configuration:
The agent uses detailed appliance-specific diagnostic questions and maintains a supportive, solution-oriented tone throughout conversations.

### Action Configuration:
Single `Customer_Intake` action handles:
- Data collection and validation
- Ticket creation
- Technician assignment  
- Automatic SMS and Email notifications

## 12. Demo Videos

### Service Request Flow:
- Customer calls with AC not cooling issue
- Agent asks diagnostic questions
- Technician assigned and scheduled
- SMS/Email confirmations sent

### Installation Request Flow:
- Customer needs new washing machine installation
- Agent collects installation requirements
- Specialized installation technician assigned
- Complete setup scheduled

## 13. Contact Information

**Project Team:** Vimal Raja J
**Email:** vimalrajaj.cse2023@citchennai.net
**Submission Date:** October 2025
**Challenge Contact:** sabhareesh.muralidharan@gnani.ai

---

## Technical Implementation Notes

- **Database**: 6 tables with proper relationships and constraints
- **Technicians**: 34+ technicians across 6+ regions with varied skills
- **Notifications**: Dual SMS/Email system with delivery tracking
- **Error Handling**: Comprehensive error handling with fallback strategies
- **Validation**: Input sanitization and format enforcement
- **Logging**: Detailed logging for debugging and monitoring
- **Security**: Environment variable based configuration
- **Scalability**: Designed for high concurrent call volume

This implementation provides a complete, production-ready consumer durables service management system with intelligent voice interface and automated workflow management.