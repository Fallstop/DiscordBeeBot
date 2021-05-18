function HtmlToDiscord(input) {
	input = input.replace(/<\/?b>/ig, '**')
	input = input.replace(/<\/?br>/ig, '\n')
	input = input.replace(/<\/?em>/ig, '***')
	input = input.replace(/<\/?strike>/ig, '~~')
	input = input.replace(/<\/?del>/ig, '~~')
	input = input.replace(/<\/?s>/ig, '~~')
	input = input.replace(/<\/?p>/ig, '\n')
	input = input.replace(/<\/?.+>/ig, '')
	return input
}
console.log(HtmlToDiscord("<b>asd</b>asd<asdasd>"))
