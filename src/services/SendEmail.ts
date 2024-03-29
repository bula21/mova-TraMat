import axios from "axios";
import DirectusAPI from "./DirectusAPI";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SibApiV3Sdk = require("@sendinblue/client");

const VELO_BACKEND = "https://velo-backend.mova.ch/api/email";

export default class SendEmail {
  /**
      * submitEmailOld
      * !!!Depricated!!!
      */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static submitEmailOld(empfaenger: [any], subject: string, body: string, nameContent: string, base64Content: string): void {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.VUE_APP_EMAIL_SECRET);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = body;
    sendSmtpEmail.to = empfaenger;
    sendSmtpEmail.sender = {
      name: "TraMat NoReply", email: "tramat.noreply@gmail.com",
    };
    sendSmtpEmail.attachment = [{
      content: base64Content, name: nameContent,
    }];

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    apiInstance.sendTransacEmail(sendSmtpEmail).then((data: any) => {
      console.log("API called successfully to send Email");
      // console.log(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, (error: any) => {
      console.error(JSON.stringify(error));
      // eslint-disable-next-line no-alert
      alert(`Email konnte nicht versendet werden ${JSON.stringify(error)}`);
    });
  }

  /**
    * submitEmail
    */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async submitEmail(empfaenger: string, subject: string, body: string, nameContent: string, content: Blob): Promise<void> {
    const formData = new FormData();
    formData.append("attachment", content, nameContent);
    formData.append("receivers", empfaenger);
    formData.append("subject", subject);
    formData.append("body", body);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    formData.append("logDbJwtToken", DirectusAPI.getToken()!);

    axios.post(VELO_BACKEND, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    }).then((data: any) => {
      console.log("API called successfully to send Email");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((reason: any) => {
      console.error(JSON.stringify(reason));
      // eslint-disable-next-line no-alert
      alert(`Email konnte nicht versendet werden ${JSON.stringify(reason)}`);
    });
  }
}
