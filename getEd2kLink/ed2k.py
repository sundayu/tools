#!usr/bin/python
# -*- coding: utf-8 -*-
import urllib2, urllib, sys, re, libxml2dom

def getEd2kLinks( url ):
    headers = {
         'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
    }
    req = urllib2.Request(
        url = 'http://secure.verycd.com/signin/*/http://www.verycd.com/',
        headers = headers
    )

    webPage = urllib2.urlopen(url)
    try:
        doc = libxml2dom.parse(webPage, 1, 'utf-8')
    finally:
        webPage.close()
    return [ getEd2kLinkFromDownloadBtn(doc), getEd2kLinkFromSubtitle(doc)]

def getEd2kLinkFromDownloadBtn(doc):
    btnDom = doc.getElementById("downloadButton")
    if btnDom:
        ed2kLink = btnDom.getAttribute("name")
        print '********  \n'+ ed2kLink + '\n ******** \n'
        return ed2kLink

def getEd2kLinkFromSubtitle(doc):
    subtitle_pattern = re.compile( 'a href="ed2k(\S+)">')
    titleDom = doc.getElementById("subtitle")
    if titleDom:
        titleHtml = titleDom.toString()
        ed2kLink = 'ed2k' + subtitle_pattern.findall(titleHtml)[0]
        print '******** \n' + ed2kLink + '\n ******** \n'
        return ed2kLink

def postEd2kLink_to_Mldonkey(link):
    url = "http://localhost:4080/submit?"
    fields = urllib.urlencode([('q','dllink+'+link)])
    postString = url + fields

    req = urllib2.Request(postString)
    fd = urllib2.urlopen(req)
    while 1:
        data = fd.read(1024)
        if not len(data):
            break
        sys.stdout.write(data) 


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('xx')
        sys.exit(1)

    url = sys.argv[1]
    ed2kLinks = getEd2kLinks(url)
    for link in ed2kLinks[0:]:
        postEd2kLink_to_Mldonkey(link)

