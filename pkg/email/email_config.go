package email

import (
	"encoding/json"
	"io/ioutil"
)

type EmailConfig string

type Recipient struct {
	Name, Email string
}

type Config struct {
	FromEmail  Recipient
	ToEmail    Recipient
	Recipients []Recipient
}

func (c EmailConfig) Parse() (Config, error) {
	fc, fileReadError := ioutil.ReadFile(string(c))
	var config Config
	if fileReadError != nil {
		return config, fileReadError
	}

	jsonUnmarshalError := json.Unmarshal(fc, &config)

	if jsonUnmarshalError != nil {
		return config, jsonUnmarshalError
	}

	return config, nil
}
