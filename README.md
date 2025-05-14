## Leave Management System (AWS Serverless)

A lightweight, production-ready leave management system built using AWS SAM, Lambda, Step Functions, DynamoDB, SES, and more. Designed for secure authentication, streamlined request handling, and automatic email notifications.

---
### 🧪 Postman Collection

🔗 [Test the API using Postman](https://www.postman.com/mission-observer-6849961/my-public-workspace/request/nhd8tdv/login?tab=body)

---

### ✅ Test Coverage (Jest)

Coverage from automated tests using **Jest**:

![Test Coverage](https://res.cloudinary.com/dlbyxcswi/image/upload/v1747252347/ChatGPT_Image_May_12_2025_08_55_13_AM_pw5qk5.png)

---

### 📐 Architecture Diagram

![Architecture Diagram](https://res.cloudinary.com/dlbyxcswi/image/upload/v1747250410/Screenshot_2025-05-15_004716_gnegum.png)

---

### ✨ Features

- JWT-based signup and login
- Leave request creation and processing
- AWS Step Functions state machine for approval workflow
- Auto-reject requests on timeout
- Approver receives actionable email (Approve/Reject)
- User gets notified upon approval or rejection
- Fully serverless architecture with scalability

---

### 📬 Email Workflow

#### 1. Leave Request Sent to Approver  
Approver receives an email with **Approve** and **Reject** options.

![Approver Email](https://res.cloudinary.com/dlbyxcswi/image/upload/v1747250459/Screenshot_2025-05-14_232335_cyhfbl.png)

#### 2. Request Approved  
User receives an email confirming the leave was approved.

![Approved Email](https://res.cloudinary.com/dlbyxcswi/image/upload/v1747250471/Screenshot_2025-05-14_232510_gbjhl7.png)

#### 3. Request Rejected or Timed Out  
If not approved in time or rejected, user gets a rejection email.

![Rejected Email](https://res.cloudinary.com/dlbyxcswi/image/upload/v1747250459/Screenshot_2025-05-14_232335_cyhfbl.png)

---

### 🧩 Tech Stack

- AWS Lambda – Serverless compute
- Amazon API Gateway – RESTful API
- DynamoDB – Data storage
- AWS Step Functions – Approval flow orchestration
- Amazon SES – Email notifications
- Amazon S3 – (Optional) Asset storage
- Node.js (TypeScript)
- AWS SAM – Infrastructure as code
- JWT – Authentication mechanism

---

### 🚀 Deployment

```bash
sam build
sam deploy --guided
