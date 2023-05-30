export interface RegisterUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  source: string;
  os: string;
  browser: string;
  type: string;
}

export interface RegisterUserRes {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    userData: {
      user: {};
      jwtToken: string;
    };
  };
  conversation: {};
}
