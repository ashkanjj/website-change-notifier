package email

import (
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func NewService(configFile string) (*Service, error) {

	// Load email configuration
	var recipients []Recipient
	emailConfig, configError := EmailConfig(configFile).Parse()

	if configError != nil {
		return nil, configError
	}

	for i := 0; i < len(emailConfig.Recipients); i++ {
		recipients = append(recipients, Recipient{Name: emailConfig.Recipients[i].Name, Email: emailConfig.Recipients[i].Email})
	}

	return &Service{Recipients: recipients, FromEmail: emailConfig.FromEmail}, nil
}

type Service struct {
	Recipients []Recipient
	FromEmail  Recipient
}

func (e *Service) Send(subject string, textContent string, htmlContent string) error {
	from := mail.NewEmail(e.FromEmail.Name, e.FromEmail.Email)
	s := subject
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	for i := 0; i < len(e.Recipients); i++ {
		to := mail.NewEmail(e.Recipients[i].Name, e.Recipients[i].Email)
		message := mail.NewSingleEmail(from, s, to, textContent, htmlContent)
		response, err := client.Send(message)
		log.Println("email response", response)
		if err != nil {
			return err
		}
	}
	return nil
}
