package websiteChangeNotifier

import (
	"os"
	"testing"
)

func TestParse(t *testing.T) {

	var configFile EmailConfig = "./example_config.json"
	_, configReadError := os.Stat(string(configFile))

	if configReadError != nil {
		t.Fatal("Couldn't read the example config file: ", configFile)
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
