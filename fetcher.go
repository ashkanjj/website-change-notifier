package main

import (
	"bytes"
	"errors"
	"golang.org/x/net/html"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

type Fetcher struct {
	url string
}

func (f Fetcher) Content() (string, error) {
	resp, err := http.Get(f.url)
	responseBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("error reading body")
	}
	defer resp.Body.Close()
	doc, _ := html.Parse(strings.NewReader(string(responseBody)))
	bn, err := Body(doc)
	if err != nil {
		return "", errors.New("error in Body")
	}
	body := renderNode(bn)
	return body, nil
}

func Body(doc *html.Node) (*html.Node, error) {
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
