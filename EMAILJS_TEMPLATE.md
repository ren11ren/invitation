# EmailJS RSVP Template

Use this template in your EmailJS dashboard as the email body for the RSVP form.

## Template ID
Set this value into `src/emailConfig.ts` as `TEMPLATE_ID`.

## Subject
New RSVP for Elyana Reign's 2nd Birthday

## Body (HTML)

```html
<h1>New RSVP Received</h1>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Guests:</strong> {{guests}}</p>
<p><strong>Attending:</strong> {{attending}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
<hr />
<p>Sent from the Elyana Reign invitation website.</p>
```

## Notes
- In EmailJS, create a new template and paste the HTML body above.
- Add the variables `name`, `guests`, `attending`, and `message` in the template.
- If you want the email to also show the destination email, you can include `to_email` in the template, but the service already sends to the configured destination.
- Once the template is created, copy its ID into `src/emailConfig.ts`.
