# INYA.AI COMPLETE INTEGRATION CONFIGURATION

## 🎯 SYSTEM PROMPT
Use the enhanced system prompt from `enhanced-system-prompt.md` which includes both new service requests and ticket status checking capabilities.

## 🔧 ACTION 1: CUSTOMER INTAKE (New Service Requests)

### Action Name:
```
Customer_Intake
```

### Description:
```
Create new service tickets for appliance repair or installation requests. This action processes customer information, appliance details, service requirements, and assigns qualified technicians. Use this when customers report new problems with AC, Washing Machine, Refrigerator, TV, or Water Purifier, or when they need installation services for new appliances.
```

### Integration:
```
68de32c8011efefb0bdd265b
```

### Call Type:
```
On-Call
```

### Method:
```
POST
```

### URL:
```
https://consumer-durabales-tracker.onrender.com/api/customer-intake
```

### Before API Call Variables:

#### Variable 1:
- **Variable Name:** `full_name`
- **Type:** `string`
- **Prompt:** `Customer's complete full name as provided during the conversation.`

#### Variable 2:
- **Variable Name:** `phone`
- **Type:** `string`
- **Prompt:** `Customer's phone number. If it's an Indian number starting with 8, 9, 7, or 6, ensure it includes +91 prefix. Format should be +91xxxxxxxxxx for Indian numbers.`

#### Variable 3:
- **Variable Name:** `email`
- **Type:** `string`
- **Prompt:** `Customer's email address for service confirmations and updates.`

#### Variable 4:
- **Variable Name:** `address_text`
- **Type:** `string`
- **Prompt:** `Complete address including house number, street, area, landmark, and city as provided by customer.`

#### Variable 5:
- **Variable Name:** `pincode`
- **Type:** `string`
- **Prompt:** `6-digit postal code of customer's location for technician assignment in their region.`

#### Variable 6:
- **Variable Name:** `request_type`
- **Type:** `string`
- **Prompt:** `Type of service needed. Use 'service' for repairs/maintenance or 'installation' for new appliance setup.`

#### Variable 7:
- **Variable Name:** `appliance_type`
- **Type:** `string`
- **Prompt:** `Type of appliance. Use exact values: 'ac' for Air Conditioner, 'washing_machine' for Washing Machine, 'refrigerator' for Refrigerator/Fridge, 'tv' for Television, 'water_purifier' for Water Purifier/RO.`

#### Variable 8:
- **Variable Name:** `model`
- **Type:** `string`
- **Prompt:** `Brand and model of the appliance if provided by customer. If not mentioned, use 'Not specified'.`

#### Variable 9:
- **Variable Name:** `fault_symptoms`
- **Type:** `array`
- **Prompt:** `Array of specific problems reported by customer based on diagnostic questions. For AC: not_cooling, making_noise, water_leakage, error_codes. For Washing Machine: not_spinning, excessive_vibration, water_issues, drainage_problems, door_issues. For Refrigerator: poor_cooling, frost_buildup, door_sealing, unusual_noises, ice_maker_issues. For TV: no_power, display_issues, audio_problems, remote_issues, input_problems. For Water Purifier: low_flow, taste_smell_issues, filter_indicators, unusual_sounds, tank_issues.`

#### Variable 10:
- **Variable Name:** `installation_details`
- **Type:** `array`
- **Prompt:** `Array of installation requirements if request_type is 'installation'. For AC: wall_mounting, electrical_setup, outdoor_unit. For Washing Machine: water_connections, positioning, electrical. For Refrigerator: positioning, electrical, old_removal. For TV: wall_mounting, cable_management, device_connections. For Water Purifier: plumbing_connections, electrical, tank_installation. Use empty array if request_type is 'service'.`

#### Variable 11:
- **Variable Name:** `preferred_time_slots`
- **Type:** `array`
- **Prompt:** `Customer's preferred time slots for service. Use: 'morning' for 9AM-12PM, 'afternoon' for 12PM-5PM, 'evening' for 5PM-8PM. Can include multiple preferences.`

### After API Call Variables:

#### Variable 1:
- **Variable Name:** `ticket_number`
- **Type:** `string`
- **Prompt:** `Generated ticket number for customer reference. Always mention this number to the customer.`

#### Variable 2:
- **Variable Name:** `technician_name`
- **Type:** `string`
- **Prompt:** `Name of assigned technician. Use this to inform customer who will handle their service.`

#### Variable 3:
- **Variable Name:** `technician_phone`
- **Type:** `string`
- **Prompt:** `Technician's contact number for customer reference and direct communication.`

#### Variable 4:
- **Variable Name:** `estimated_response_time`
- **Type:** `string`
- **Prompt:** `Expected time for technician to contact customer or arrive for service.`

#### Variable 5:
- **Variable Name:** `service_status`
- **Type:** `string`
- **Prompt:** `Current status of the service request for customer confirmation.`

### Headers:
```
Key: Content-Type
Value: application/json
```

### Timeout:
```
15
```

---

## 🔧 ACTION 2: TICKET STATUS CHECK

### Action Name:
```
Check_Ticket_Status
```

### Description:
```
Check the status of existing service request tickets. This action retrieves comprehensive information about a service ticket including current status, customer details, service information, assigned technician details, appointment scheduling, and progress updates. Use this when customers want to know the status of their existing service request by providing their ticket number (format: TKT followed by 6 digits, e.g., TKT755803).
```

### Integration:
```
68de32c8011efefb0bdd265b
```

### Call Type:
```
On-Call
```

### Method:
```
GET
```

### URL:
```
https://consumer-durabales-tracker.onrender.com/api/ticket-status/{ticket_number}
```

### Before API Call Variables:

#### Variable 1:
- **Variable Name:** `ticket_number`
- **Type:** `string`
- **Prompt:** `Extract the ticket number from customer's speech. Ticket numbers always start with 'TKT' followed by exactly 6 digits (e.g., TKT755803, TKT758710). If customer says variations like 'ticket number 755803' or 'my ticket is 755803', add 'TKT' prefix to make it TKT755803. If no valid ticket number is provided, ask the customer to provide their complete ticket number which they received via SMS or email confirmation.`

### After API Call Variables:

#### Variable 1:
- **Variable Name:** `current_status`
- **Type:** `string`
- **Prompt:** `Current status of the ticket (created, assigned, scheduled, in_progress, completed). Use this to inform customer about current stage of their service request.`

#### Variable 2:
- **Variable Name:** `customer_name`
- **Type:** `string`
- **Prompt:** `Customer name from the ticket to confirm identity and personalize response.`

#### Variable 3:
- **Variable Name:** `service_details`
- **Type:** `string`
- **Prompt:** `Service information including appliance type, request type, and problem description in customer-friendly language.`

#### Variable 4:
- **Variable Name:** `technician_info`
- **Type:** `string`
- **Prompt:** `Technician assignment details including name and contact number. If no technician assigned yet, inform about assignment progress.`

#### Variable 5:
- **Variable Name:** `appointment_info`
- **Type:** `string`
- **Prompt:** `Appointment details including date, time, and status. If not scheduled, provide information about when scheduling will happen.`

#### Variable 6:
- **Variable Name:** `next_steps`
- **Type:** `string`
- **Prompt:** `What happens next based on current status, including timelines and customer actions needed.`

### Headers:
```
Key: Content-Type
Value: application/json
```

### Timeout:
```
10
```

---

## 🎯 KEY FEATURES DEMONSTRATED:

### 1. COMPREHENSIVE SERVICE HANDLING
- New service requests with appliance-specific diagnostics
- Real-time ticket status checking
- Technician assignment and scheduling
- SMS + Email notifications

### 2. INTELLIGENT CONVERSATION FLOW
- Automatic detection of service type (new request vs status check)
- Context-aware responses based on appliance type
- Follow-up support for existing customers

### 3. ADVANCED DIAGNOSTIC CAPABILITIES
- Appliance-specific troubleshooting questions
- Detailed problem categorization
- Priority-based technician assignment

### 4. CUSTOMER EXPERIENCE EXCELLENCE
- Personalized service with customer name recognition
- Clear communication of next steps
- Multiple contact methods for technician coordination
- Comprehensive status updates

## 🚀 TESTING SCENARIOS:

### Scenario 1: New AC Service Request
Customer: "My AC is not cooling properly"
→ Uses Customer_Intake action with AC-specific diagnostics

### Scenario 2: Ticket Status Inquiry  
Customer: "I want to check my ticket TKT755803"
→ Uses Check_Ticket_Status action to provide real-time updates

### Scenario 3: Installation Request
Customer: "I need help installing a new washing machine"
→ Uses Customer_Intake action with installation-specific questions

This complete configuration showcases a professional, enterprise-grade customer service system with intelligent routing, comprehensive diagnostics, and real-time status tracking!