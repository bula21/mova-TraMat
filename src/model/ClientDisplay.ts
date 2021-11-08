/* eslint-disable camelcase */

class ClientDisplay {
  id?: number;
  created_on?: string | undefined;
  modified_by?: string | undefined;
  modified_on?: string | undefined;
  name?: string | undefined;
  street?: string | undefined;
  place?: string | undefined;
  phone?: null | string;
  zipcode?: number | undefined;
  email?: string | null | undefined;
  type?: string | undefined;
}

export default ClientDisplay;
