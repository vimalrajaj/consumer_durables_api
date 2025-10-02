# Consumer Durables Service Platform - Technical Architecture

## System Overview
Complete service management platform for Consumer Durables AI Agent with Inya.ai integration.

## Components to Build

### 1. Main API Server (Express.js)
- Customer data collection endpoint
- Ticket creation and management
- Technician matching algorithm
- Appointment scheduling system
- Region mapping via pincode API

### 2. Database Schema (JSON/MongoDB)
```json
{
  "customers": {
    "id": "cust_001",
    "full_name": "John Doe",
    "phone": "+91-9876543210",
    "email": "john@email.com",
    "address_text": "123 Main St, Koramangala",
    "pincode": "560034",
    "region_label": "Bengaluru Urban",
    "preferred_time_slots": ["morning", "evening"]
  },
  "tickets": {
    "id": "ticket_001",
    "customer_id": "cust_001",
    "request_type": "service",
    "appliance_type": "washing_machine",
    "model": "Samsung WF700",
    "fault_symptoms": ["not_spinning", "making_noise"],
    "urgency": "medium",
    "status": "assigned",
    "created_at": "2025-10-02T10:30:00+05:30"
  },
  "technicians": {
    "id": "tech_001",
    "name": "Asha Kumar",
    "skills": ["wm_motor", "wm_vibration", "ac_cooling"],
    "appliances_supported": ["washing_machine", "ac"],
    "regions": ["bengaluru_urban", "bengaluru_rural"],
    "availability_slots": [
      {"start": "2025-10-03T10:00:00+05:30", "end": "2025-10-03T12:00:00+05:30"}
    ]
  },
  "appointments": {
    "id": "appt_001",
    "ticket_id": "ticket_001",
    "customer_id": "cust_001",
    "technician_id": "tech_001",
    "slot_start": "2025-10-03T10:00:00+05:30",
    "slot_end": "2025-10-03T11:00:00+05:30",
    "status": "confirmed"
  }
}
```

### 3. API Endpoints for Inya.ai Integration
```
POST /api/customer-intake
POST /api/create-ticket
POST /api/schedule-appointment
POST /api/send-notifications
GET /api/ticket-status/:id
```

### 4. Notification Services
- SMS integration (Twilio)
- Email integration (SendGrid)
- WhatsApp notifications (optional)

### 5. External Integrations
- Pincode API (api.postalpincode.in)
- SMS Gateway
- Email Service
- Calendar/Scheduling API

## Deployment Strategy
- Development: Local Node.js
- Production: Render.com (auto-deployment)
- Database: JSON files initially, MongoDB later
- Domain: Custom domain for API endpoints

## Inya.ai Integration Flow
1. Customer calls → Inya.ai agent
2. Agent collects: service/installation intent
3. Agent asks appliance-specific questions
4. Agent captures customer details
5. Agent calls our API → creates ticket
6. Our system matches technician
7. Our system sends confirmation SMS/Email
8. Agent provides ticket ID to customer

## Next Steps
1. Build core API server
2. Create mock data (technicians, regions)
3. Implement pincode lookup
4. Add SMS/Email services
5. Deploy to Render
6. Configure Inya.ai integration
7. Test end-to-end flow