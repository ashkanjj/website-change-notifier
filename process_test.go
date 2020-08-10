package websiteChangeNotifier

import (
	"testing"
	"time"
)

type TestFetch struct {
	content string
}

func (t TestFetch) Fetch() (string, error) {
	return t.content, nil
}

type TestSnapshot struct {
	content string
}

func (s TestSnapshot) Read() (string, error) {
	return s.content, nil
}

func (s *TestSnapshot) Save(content string) error {
	// overwrite content with what's passed in
	s.content = content

	return nil
}

type MockEmail struct {
	subject     string
	textContent string
	htmlContent string
}

type TestEmailSender struct {
	Emails []MockEmail
}

func (T *TestEmailSender) Send(subject string, textContent string, htmlContent string) error {
	T.Emails = append(T.Emails, MockEmail{subject, textContent, htmlContent})
	return nil
}

func TestProcessWithChange(t *testing.T) {

	fetcher := TestFetch{content: "This is my content"}
	snapshot := TestSnapshot{content: "This is some other content"}
	email := TestEmailSender{Emails: make([]MockEmail, 0)}
	Process(fetcher, &snapshot, &email, time.Second*1, true)

	if email.Emails[0].subject != "Website change notifier" {
		t.Fatal("Subject not sent")
	}

	if fetcher.content != snapshot.content {
		t.Fatal("the fetched content was not saved to snapshot", snapshot.content, fetcher.content)
	}
}
