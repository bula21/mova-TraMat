/* eslint-disable camelcase */

class ClientDisplay {
  id?: number;
  created_on?: Date | undefined;
  modified_by?: Date | undefined;
  modified_on?: Date | undefined;
  name?: string | undefined;
  street?: string | undefined;
  place?: string | undefined;
  phone?: string | undefined;
  zipcode?: number | undefined;
  email?: string | null | undefined;
  type?: string | undefined;
}

export default ClientDisplay;
