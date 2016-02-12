---
layout: post
title: JS tips and styling code snippets.
---

Starting to enjoy frontend development. Couldn't add the comment section though. <br>
Switched back to Sublime from Vim. Served Jekyll.

I wanted to style code snippets. For now, it's a simple box with a border. <br>
I've used the following HTML and CSS properties for now. <br>

<div class="bullet_numbers">
	1.	white-space:pre' to preserve line-breaks and spaces to retain indentation. <br>
	2. 	Padding of 20px, 90% width, scroll overflow. <br>
	3.	Used 'pre' html tags to display text in fixed-width font. <br>
	4.  Used black background and color green. <br> 
</div>
Todo: Style code components.

<pre class="code_snippet">
	var foo = [1,2,3];
	var bar = [1,2,3];
	var foo2 = foo;
	var bar2 = bar;
	foo = [];
	bar.length = 0;
	console.log(foo, bar, foo2, bar2);
</pre>

The output of the above code snippet is actually quite interesting. 

<pre class="code_snippet">
	[] [] [1, 2, 3] []
</pre>

This is because "array = []" assigns a reference to a new array to a variable, while any other references are unaffected. which means that references to the contents of the previous array are still kept in memory. But "array.length = 0" effectively deletes all everything in the array which affects other references as well. 

 
<b><i>Daily shots</i></b> for the day.<br>
<b>Repo of the day</b>: <a href="https://github.com/loverajoel/jstips"> One JS tip a day </a>. This is where I am learning(and shamelessly ripping off) one new thing about JS everyday and updating here. <br>
<b>Article of the day</b>: <a href="http://www.amnh.org/education/resources/rfl/web/essaybooks/cosmic/cs_paradox.html">Olber's Paradox: Why Is The Sky Dark at Night?</a>. Lovely read.<br>
<b>Sandcastle of the day</b>: (Suggestions from Mum take high priority, so) adding functionality to comment. Yes, still on. <br>



