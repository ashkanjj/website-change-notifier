package main

import (
	"io/ioutil"
)

type Snapshot struct {
	directory string
	src       string
}

func (s Snapshot) ReadFile() (string, error) {
	content, err := ioutil.ReadFile(s.PathToFile())
	return string(content), err
}

func (s Snapshot) SaveFile(content string) error {
	c := []byte(content)
	err := ioutil.WriteFile(s.PathToFile(), c, 0644)
	if err != nil {
		return err
	}
	return nil
}

func (s Snapshot) PathToFile() string {
	return s.directory + "/" + s.src
}
