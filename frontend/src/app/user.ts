export class User {
  public id: String;
  public service_id: String;
  public authenticatedService: String;
  public firstName: String;
  public familyName: String;
  public email: String;
  public allowedEvents: Array<String>;


  constructor(data) {
    this.id = data.data._id;
    this.firstName = data.data.firstName;
    this.familyName = data.data.familyName;
    this.email = data.data.email;
    this.authenticatedService = data.data.authenticatedServices;
    this.allowedEvents = data.data.allowedEvents;
    this.service_id = data.data.service_id;
  }
}
