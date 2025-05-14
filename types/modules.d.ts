export {}
declare global {
    interface RequestBody {
        userName?: string
        email?: string;
        password?: string

      }

    interface applyLeaveEvent {
      name: string;
      startDate: string;
      endDate: string;
      reason: string;
    }
      
    interface applyLeaveEvent {
      name: string,
      startDate: Date,
      endDate: Date,
      reason: string
    }

    interface sendRequestFunctionEventType {
      userName: string;
      leaveId: string;
      userEmail: string;
      taskToken: string;
      startDate: string;
      endDate: string;
      apiBaseUrl: string;
      reason: string;
      adminEmail: string;
    }
    
    interface LoginRequestBody {
      userName: string;
      password: string;
    }
    
    type LeaveApprovalStatus = "APPROVED" | "REJECTED" | "PENDING";
    
    type LeaveApprovalEvent = {
      approvalStatus: LeaveApprovalStatus;
      leaveEndDate: string;     
      leaveId: string;
      userEmail: string;
      userName: string;
      leaveStartDate: string;  
      reason: string;
    };

    interface JwtPayload {
      userName: string;
      userEmail: string;
      role: string;
    }

    interface UserItem {
      password: string;
      email: string;
      userName: string;
    }

    interface ApiResponse {
    statusCode: number;
    body: string;
    headers?: { [key: string]: string };
    }

    interface ApiErrorDetail {
    message: string;
    type?: string;
    code?: string | number;
    stack?: string; 
    }
}