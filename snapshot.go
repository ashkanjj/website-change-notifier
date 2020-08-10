package websiteChangeNotifier

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"

	"github.com/gosimple/slug"
)

const DateFormat = "2006-Jan-02-15:04:05"

type Snapshot struct {
	Directory string
}

func NewSnapshot(baseDir, url string) (Snapshot, error) {
	_, snapFolderExistsError := os.Stat(baseDir)
	if snapFolderExistsError != nil {
		return Snapshot{}, errors.New("Can't find snapshot folder")
	}

	// create a directory for the snapshot if one doesn't exist
	slug := slug.Make(url) // sluggify the input url for use as a folder name
	var slugNameMaxChar int
	if len(slug) < 30 {
		slugNameMaxChar = len(slug)
	} else {
		slugNameMaxChar = 30
	}
	slug = slug[0:slugNameMaxChar] // limit the length to 30 to avoid long file names
	folder := filepath.Join(baseDir, slug)

	if err := os.MkdirAll(folder, os.ModePerm); err != nil {
		// snapshot folder could not be created
		return Snapshot{}, err
	}
	return Snapshot{Directory: folder}, nil
}

func (s Snapshot) ReadLatest() (string, error) {
	latestSnap := s.path("latest")
	content, err := ioutil.ReadFile(latestSnap)
	return string(content), err
}

func (s Snapshot) Save(content string) error {
	c := []byte(content)
	fmt.Println("what path?", s.path("latest"))
	if latestWriteErr := ioutil.WriteFile(s.path("latest"), c, 0644); latestWriteErr != nil {
		return latestWriteErr
	}

	dirName := time.Now().Format(DateFormat)

	if timeStampWriteErr := ioutil.WriteFile(s.path(dirName), c, 0644); timeStampWriteErr != nil {
		return timeStampWriteErr
	}

	return nil
}

func (s Snapshot) path(filename string) string {
	p := filepath.Join(s.Directory, filename)
	return p
}
