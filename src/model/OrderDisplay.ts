/* eslint-disable camelcase */
class OrderDisplay {
  id?: number;
  state?: string;
  delivery_date?: string;
  pick_up_date?: string;
  principal?: string;
  principal_id?: number;
  principal_email?: string;
  shipper?: string;
  receiver?: string;
  shipper_place?: string;
  receiver_place?: string;
  shipper_zip?: number;
  receiver_zip?: number;
  weight?: number;
  cbm?: number;
  pos?: number;
  posDescription?: string;
}

export default OrderDisplay;
