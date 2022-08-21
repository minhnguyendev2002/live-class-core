
export class DefaultHeaders {
  _token: string;
  _id: string;
  role_name:string;
  _user_data:string;
}

export class ServicePackHeader extends DefaultHeaders {
  extra_data: string //type of ServicePackTransaction;
}