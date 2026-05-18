type responseParams = {
  statusCode: number;
  message?: string;
  data: any;
};

class APIresponse {
  statusCode: number;
  message?: string;
  data: any;
  constructor({ statusCode, data, message = "sucess" }: responseParams) {
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message);
  }
}

export default APIresponse;
