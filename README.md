FoxTail
=======

Private Repo for FoxTail Artisanry Website

------------------------
Main Page (.\index.html)
  Need
  Want
    - Do not implement - Just trying to find out the feasibility.  Main desire is to be able to add to the news area in a smooth way -while- adding to other places like facebook or tumblr.  Currently, news and sales both being handled by editing the index.html directly with a text editor.
	  Would very much like to see if ' https://developers.facebook.com/docs/reference/plugins/like-box/ ' can be plugged in where the News is, as that would solidly deal with the news and require me to update less places.  Setting would be for only the 'Show Posts', and nothing else.
	    Problem One - It is noted that it likely will not be a 'responsive' object
	    Problem Two - "It just won't work."  At least, that's the words my uneducated self has been making however I've tried it.  Start with the default page url in it, as I have no pages with appropriate material filled for testing currently, and it's easy enough to change.
		http://stackoverflow.com/questions/10656038/how-to-make-the-facebook-like-box-responsive
		Don't know if that will work, but.. 
		Old Scotch Note -- seems like it behaves responsively in chrome so far
  Nitpicking
	It'd be nice to actually get the curve at the bottom of the image carousel to match that at the top, or do away with the curve at the bottom.  
    It'd probably be smart of me to sit down and unify the margins I'm using, as it seems I'm using barely any on most text, and a fairly noticeable one on news and sales.

------------------------
Gallery Pages (./gallery.html)
  Need
  Want
  Nitpicking
    I'm curious if there's a way to make the box borders for all three products in a row match up to the largest one automatically.

------------------------
Product Pages (./products/Bracelet-HP4-in-1.html for example)
  Need
  Want
  Nitpicking
	It'd be nice to actually get the curve at the bottom of the image carousel to match that at the top, or do away with the curve at the bottom.  
    It'd probably be smart of me to sit down and unify the margins I'm using... again...

------------------------
Contact Page (./contact.html)
  Need
    In website email contact form, with input boxes for Email Address, Name, Message.  Form would then send an email to foxtailartisanry@gmail.com, with a subject of Foxtail Webform - <name>, and body of <name> on first line, <email address> on the second line, empty line, and finally the message.  Ideally.
  Want
    It'd be nice to have a captcha code setup to help cut down on easy spamming through the email form itself.  It may seem silly when you could just copy-paste the email address (which will be posted still) and spam it directly, but that doesn't cause workload on the system with a looping click'n'send script, soo.. It just seems like a good idea.
  Nitpicking
    An ability to toggle the captcha usage on and off, so it's there if we need it, but kept off till someone misbehaves.

------------------------
Misc Pages
  Need
  Want
    It's almost a need, but it's really a want, heh.  A web shop back end, allowing for people to impulse purchase directly, without relying on sending them off to Etsy or Goodsmiths.
	Database integration and usage.
	  Long rambling version.  I want to be able to update the prices from a single database, rather than editing every page.  I want to be able to define prices by length of product, so I can easily let people go, 'Oh, I'd like a 16" choker necklace and it's <x*16>, or maybe a 30" deep hanging necklace and it's <x*30>'.  The ability to apply cost modifiers based on materials.  So on.  Even without a web shop, it would go a long way to putting the ability to get good price estimates directly into the hands of a curious customer.  It is -far- from a need, nor is it remotely a priority.  But it would be nice!
  Nitpicking
    Find and add a mini-logo to the top bar for Goodsmiths, as if it's still free, we'll be signing up with them too, and populating the store at the same time as the Etsy.

  Do NOT Want - Probably _EVER_.
	Sounds
	Animations (Gifs and such)
	Flash
	Comment Fields
    Frames










------- OLD And Outdated ------ Ignore this! ------
------- OLD And Outdated ------ Ignore this! ------
------- OLD And Outdated ------ Ignore this! ------

To Do list that needs a Scotch-help.

Misc Notes
	http://flexslider.woothemes.com/index.html
	-- Initial implementation done.  Need to make it pretty.
	
	
Main Page (.\index.html)
	Either..
		Need to remove the big gap between top of page and image carousel.
		-- reduced top gap from 60 px to 35 px.
		== Lovely!  Now if we can match that gap on the bottom, at least as far as the image itself is concerned, ending up with the dot's in that gap..
		  And on further thought, image should -either- be rounded both top and bottom (more ideal to me, to match the rest of the design style), or sharp edged on both (consistancy!).  Whatever's more viable, as it's not a 'must' for either.
		  Fixing displayed height for next/previous buttons is a good thing too.  And yess, I know you probably noticed all this, but you urge me to be thorough.

	Image carousel
	-- Added flexslider
		
	Would very much like to see if ' https://developers.facebook.com/docs/reference/plugins/like-box/ ' can be plugged in where the News is, as that would solidly deal with the news.  One problem noted is that it likely will not be a 'responsive' object, and we've already got some ugliness from the image carousel for that.  Problem two is 'It just won't work' however I've tried it.  Start with the default page url in it, as I have no pages with appropriate material filled for testing currently, and it's easy enough to change.
		http://stackoverflow.com/questions/10656038/how-to-make-the-facebook-like-box-responsive
			Don't know if that will work, but.. 
		-- seems like it behaves responsively in chrome so far
		
Product Pages
	If you've looked at .\products\Bag-Medium.html, you've seen there's a serious need for a thumbnailed display.  A layout like your original image carousel that is currently disabled in the .\index.html, without the image's switching on a rotation, would probably be the best solution.. as well as me switching from highest quality PNG's down to something yielding more sane file sizes. ^_^  Result would need to be responsive though.  - I suggest flexslider again here?

	
