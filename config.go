package main

import (
	"encoding/json"
	"io/ioutil"
)

type ConfigFile string

type Recipient struct {
	Name, Email string
}

type Config struct {
	FromEmail  Recipient
	ToEmail    Recipient
	Recipients []Recipient
}

func (c ConfigFile) Parse() (Config, error) {
	fc, err := ioutil.ReadFile(string(c))
	var config Config
	if err != nil {
		return config, err
	}
	jsonError := json.Unmarshal(fc, &config)

	if jsonError != nil {
		return config, jsonError
	}

	return config, nil
}
