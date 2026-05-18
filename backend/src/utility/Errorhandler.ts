type ErrorParams = {
  statusCode: number;
  message : string;
};

class Errorhandler extends Error {
  statusCode: number;
  message : string;
  success: boolean;
  constructor({ statusCode, message="Something went wrong !" }: ErrorParams) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
  }
}

export default Errorhandler