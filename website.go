package websiteChangeNotifier

import (
	"bytes"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gosimple/slug"
	"golang.org/x/net/html"
)

// Website respresentation of a website
type Website struct {
	ID  string
	URL string
}

// Fetch uses http.Get to fetch the website
func (w *Website) Fetch() (string, error) {

	resp, err := http.Get(w.URL)
	if err != nil {
		return "", err
	}
	responseBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("error reading body")
	}
	defer resp.Body.Close()
	doc, _ := html.Parse(strings.NewReader(string(responseBody)))
	bn, err := htmlBody(doc)
	if err != nil {
		return "", errors.New("error in Body")
	}
	body := renderNode(bn)
	return body, nil
}

// NewWebsite creates a new instace of Website
func NewWebsite(url string, store Store) (*Website, error) {
	id := createWebsiteID(url)
	// Inser the website into the db
	err := store.CreateWebsite(id, url)
	return &Website{URL: url, ID: string(id)}, err
}

func createWebsiteID(url string) string {
	// create a directory for the snapshot if one doesn't exist
	slug := slug.Make(url) // sluggify the input url for use as a folder name
	var slugNameMaxChar int
	if len(slug) < 30 {
		slugNameMaxChar = len(slug)
	} else {
		slugNameMaxChar = 30
	}
	slug = slug[0:slugNameMaxChar] // limit the length to 30 to avoid long file names
	return slug
}

func htmlBody(doc *html.Node) (*html.Node, error) {
	// copied from the top answer in https://stackoverflow.com/questions/30109061/golang-parse-html-extract-all-content-with-body-body-tags
	var body *html.Node
	var crawler func(*html.Node)
	crawler = func(node *html.Node) {
		if node.Type == html.ElementNode && node.Data == "body" {
			body = node
			return
		}
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			crawler(child)
		}
	}
	crawler(doc)
	if body != nil {
		return body, nil
	}
	return nil, errors.New("Missing <body> in the node tree")
}

func renderNode(n *html.Node) string {
	var buf bytes.Buffer
	w := io.Writer(&buf)
	html.Render(w, n)
	return buf.String()
}
