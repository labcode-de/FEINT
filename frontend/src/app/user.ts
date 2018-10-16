export class User {
  public id: String;
  public service_id: String;
  public authenticatedService: String;
  public firstName: String;
  public familyName: String;
  public email: String;
  public allowedEvents: Array<String>;


  constructor(data) {
    this.id = data._id;
    this.firstName = data.firstName;
    this.familyName = data.familyName;
    this.email = data.email;
    this.authenticatedService = data.authenticatedServices;
    this.allowedEvents = data.allowedEvents;
  }
}
