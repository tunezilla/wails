//go:build windows
// +build windows

package windows

import (
	"github.com/pkg/browser"
	"golang.org/x/sys/windows"
)

var fallbackBrowserPaths = []string{
	`\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
	`\Program Files\Google\Chrome\Application\chrome.exe`,
	`\Program Files (x86)\Google\Chrome\Application\chrome.exe`,
	`\Program Files\Mozilla Firefox\firefox.exe`,
}

// BrowserOpenURL Use the default browser to open the url
func (f *Frontend) BrowserOpenURL(url string) {
	// Specific method implementation
	err := browser.OpenURL(url)
	if err == nil {
		return
	}
	for _, fallback := range fallbackBrowserPaths {
		if err2 := openBrowser(fallback, url); err2 == nil {
			f.logger.Warning("default browser.OpenURL failed but fell back to %v, original err: %v", fallback, err.Error())
			return
		}
	}
	f.logger.Error("default browser.OpenURL failed, no fallback browser success, original err: %v", err.Error())
}

func openBrowser(path, url string) error {
	return windows.ShellExecute(0, nil, windows.StringToUTF16Ptr(path), windows.StringToUTF16Ptr(url), nil, windows.SW_SHOWNORMAL)
}
