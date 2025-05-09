export {}
declare global {
    interface RequestBody {
        userName?: string
        email?: string;
        password?: string

      }

      
      
    interface applyLeaveEvent {
      name: string,
      startDate: Date,
      endDate: Date,
      reason: string
    }

    interface SendApprovalFunctionEventType {
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
}