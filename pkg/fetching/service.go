package fetching

import (
	"bytes"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

	"golang.org/x/net/html"
)

type Service struct {
	URL string
}

func NewService(url string) *Service {
	return &Service{URL: url}
}

// Fetch uses http.Get to fetch the website
func (s *Service) Fetch() (string, error) {

	resp, err := http.Get(s.URL)
	if err != nil {
		return "", err
	}
	responseBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("error reading body")
	}
	defer resp.Body.Close()
	doc, _ := html.Parse(strings.NewReader(string(responseBody)))
	bn, err := s.htmlBody(doc)
	if err != nil {
		return "", errors.New("error in Body")
	}
	body := s.renderNode(bn)
	return body, nil
}

func (s *Service) htmlBody(doc *html.Node) (*html.Node, error) {
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

func (s *Service) renderNode(n *html.Node) string {
	var buf bytes.Buffer
	w := io.Writer(&buf)
	html.Render(w, n)
	return buf.String()
}
