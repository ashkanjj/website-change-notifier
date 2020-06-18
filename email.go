package main

import (
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"log"
	"os"
)

type EmailService struct {
	recipients []Recipient
	fromEmail  Recipient
}

func (e *EmailService) Send(subject string, textContent string, htmlContent string) error {
	from := mail.NewEmail(e.fromEmail.Name, e.fromEmail.Email)
	s := subject
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	for i := 0; i < len(e.recipients); i++ {
		to := mail.NewEmail(e.recipients[i].Name, e.recipients[i].Email)
		message := mail.NewSingleEmail(from, s, to, textContent, htmlContent)
		response, err := client.Send(message)
		log.Println("email response", response)
		if err != nil {
			return err
		}
	}
	return nil
}
