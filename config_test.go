package websiteChangeNotifier

import (
	"io/ioutil"
	"testing"
)

func TestParse(t *testing.T) {

	var configFile EmailConfig = "./example_config.json"
	configContent, readError := ioutil.ReadFile(string(configFile))

	if readError != nil {
		t.Fatal("Couldn't read the example config file: ", configFile)
	}

	var fileContent []byte = []byte(configContent)
	writeFileErr := ioutil.WriteFile(string(configFile), fileContent, 0644)

	if writeFileErr != nil {
		t.Fatal("Couldn't create the temp config file")
	}

	json, err := configFile.Parse()

	if err != nil {
		t.Fatal("Error parsing the config", err)
	}
	if json.FromEmail.Email != "from@email.com" || json.FromEmail.Name != "ash" {
		t.Fatal("FromEmail was not parsed`")
	}

	if json.Recipients[0].Email != "ash@ash.com" || json.Recipients[0].Name != "ash" {
		t.Fatal("Recipients were not parsed correctly")
	}

}
