// Authentication related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  contactNumber: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  resetToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordValidationRequest {
  password: string;
}

export interface PasswordValidationResponse {
  isValid: boolean;
  errors: string[];
}

export interface ValidationResponse {
  isValid: boolean;
  message: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  contactNumber?: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  contactNumber: string;
  fullName: string;
  isEmailValidate: boolean;
  isGoogleAuth: boolean;
  status: string;
  createdAt: string;
  modifiedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfileDto;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiResponseUserProfileDto
  extends ApiResponse<UserProfileDto> {}
export interface ApiResponseValidationResponse
  extends ApiResponse<ValidationResponse> {}
export interface ApiResponseVoid extends ApiResponse<void> {}

// User Search & Invitation Management Types
export interface UserSearchDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  fullName: string;
}

export interface InvitationDto {
  id: string;
  userId: string;
  nexId: string;
  type: "INVITE";
  message: string;
  isRead: boolean;
  createdAt: string;
  modifiedAt: string;
  userName: string;
  userEmail: string;
  nexName: string;
}

export interface SettlementSummary {
  totalOwed: number;
  totalOwes: number;
  netBalance: number;
  settledAmount: number;
}

export interface SettlementHistoryView {
  id: string;
  nexName: string;
  description: string;
  amount: number;
  type: "PAYMENT" | "EXPENSE";
  date: string;
  settledWith: string;
}

export interface SettlementAnalytics {
  monthlySpending: number;
  totalGroupExpenses: number;
  averageExpensePerGroup: number;
  mostActiveGroup: string;
}
