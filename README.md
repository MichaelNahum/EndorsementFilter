# EndorsementFilter

Designed to filter out social media posts that our employees have already processed. Every such posting 
-- known internally as an "endorsement" -- generates an automatic email to our Gmail accounts. 

EndorsementFilter runs queries against the Gmail API based on user-provided search terms. If that search term appears
in any of the last 100 or so emails, a div containing the headline and date will appear. If not, it's verified as new.

Future updates: 
-Pushing back the range of the API query to ~1 week's worth of emails. 
-Extracting additional data from each email: the non-English source language, the source handle, the precedence level 
 it was processed at, and the estimated source area.
-Color-coding search results based on urgency. 
