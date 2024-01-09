class AppErr extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
  
    constructor(msg: string, statusCode?: number) {
      super(msg);
      this.statusCode = statusCode ? statusCode : 500;
      this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppErr;