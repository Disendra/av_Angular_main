import { Component, TemplateRef, ViewChild } from '@angular/core'
import { FaServiceService } from 'src/app/services/fa-service.service'
import { PopupService } from 'src/app/services/popup.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  personName: any
  emailId: any
  mobileNumber: any
  subject: any
  message: any;
  errorMsg : any;
  alertSymbol! : string;
  captchaResponse: string = '';
  buttonType : string = '';
  showErrors : boolean = false;
  showSuccess : boolean = false;
  showSpinner : boolean = false;
  captchaResolved : boolean = false;
  @ViewChild('myDialog') myDialog!: TemplateRef<any>  
  @ViewChild('captcha') captcha!: TemplateRef<any>
  constructor (private faService: FaServiceService,  private popup: PopupService) {}


  onSubmit() {
    this.showSpinner = true;

    const isMobileValid = this.validateMobileNumber();
    const isEmailValid = this.emailId ? this.validateEmail() : true;
    const isSubjectValid = this.validateSubject('subject');

    if (!isMobileValid || !isEmailValid || !isSubjectValid) {
        this.showErrors = true;
        this.showSuccess = false;
        this.showSpinner = false;
        this.alertSymbol = 'Oops!';
        this.buttonType = 'Retry';
        this.popup.openDialogWithTemplateRef(this.myDialog);
        return;
    }

    this.validateCaptcha();
}

validateMobileNumber() {
    const mobileNumberString = this.mobileNumber.toString().replace(/\D/g, ''); 
    if (mobileNumberString.length !== 10) {
        this.errorMsg = 'Please enter a valid mobile number';
        return false;
    }
    return true;
}

validateEmail() {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (!emailRegex.test(this.emailId)) {
        this.errorMsg = 'Please enter a valid email address';
        return false;
    }
    return true;
}

validateSubject(type: string) {
    if (this.subject.length < 20) {
        this.errorMsg = 'Please enter a ' + type + ' with at least 20 characters';
        return false;
    }
    return true;
}

validateCaptcha() {
    this.popup.openDialogWithTemplateRef(this.captcha);
}

resolved(captchaResponse: string | null) {
    if (captchaResponse !== null) {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
        this.captchaResolved = true;
        this.popup.closeDialog();
        this.submitForm();
    } else {
        console.log('Captcha response is null');
    }
}

submitForm() {
    const contactData = {
        personName: this.personName,
        emailId: this.emailId,
        mobileNumber: this.mobileNumber,
        subject: this.subject,
        message: this.message,
        jjjh: "hjjhjjj"
    };

    this.faService.contactUs(contactData).subscribe(
        (response: any) => {
            this.handleSuccess(response.message);
        },
        (error: any) => {
            this.handleError(error);
        }
    );
}

handleSuccess(message: string) {
    this.errorMsg = message;
    this.showSpinner = false;
    this.alertSymbol = 'Success';
    this.showSuccess = true;
    this.showErrors = false;
    this.buttonType = 'OK';
    this.popup.openDialogWithTemplateRef(this.myDialog);
}

handleError(error: any) {
    console.error('An error occurred:', error);
    this.showSpinner = false;
    alert('An error occurred. Please try again later.');
}

  onClear() {
    if(this.buttonType === 'OK') {
      window.location.reload();
    }
  }

}