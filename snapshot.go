package websiteChangeNotifier

import (
	"io/ioutil"
)

type Snapshot struct {
	Directory string
	Src       string
}

func (s Snapshot) Read() (string, error) {
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
	return s.Directory + "/" + s.Src
}
