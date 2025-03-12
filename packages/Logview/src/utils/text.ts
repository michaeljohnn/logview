export function wrapLinks(text: string) {
  // Regular expressions are used to match urls
  const urlPattern = /(\b(https|http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  return text.replace(urlPattern, function (url: string) {
    // Create the <a> tag and return
    return '<a class="text-link" href="' + url + '" target="_blank">' + url + '</a>';
  });
}

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Copied to clipboard: ' + text);
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
}
