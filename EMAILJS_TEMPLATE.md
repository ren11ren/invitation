# EmailJS RSVP Template

Use this template in your EmailJS dashboard as the email body for the RSVP form.

## Template ID
Set this value into `src/emailConfig.ts` as `TEMPLATE_ID`.

## Subject
🎉 New RSVP Received for Elyana Reign's Birthday

## Body (HTML)

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="font-size: 16px; font-weight: 600; color: #2c3e50; margin-bottom: 8px;">
    🎉 New RSVP Received!
  </div>

  <div style="font-size: 13px; color: #666;">
    A new guest has responded to the invitation for <strong>Elyana Reign</strong>.
  </div>

  <div style="margin-top: 20px; padding: 15px 0; border-width: 1px 0; border-style: dashed; border-color: #d1d5db;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: top; width: 50px;">
          <div style="padding: 8px; margin-right: 12px; background-color: #f0fdf4; border-radius: 50%; font-size: 24px; text-align: center;" role="img">
            ✉️
          </div>
        </td>
        <td style="vertical-align: top;">
          <div style="color: #111827; font-size: 18px; font-weight: bold;">
            {{name}}
          </div>

          <div style="margin-top: 8px; font-size: 14px; line-height: 1.6;">
            <p style="margin: 2px 0;"><strong>Attending:</strong> {{attending}}</p>
            <p style="margin: 2px 0;"><strong>Number of Guests:</strong> {{guests}}</p>
          </div>

          <div style="margin-top: 12px; padding: 10px 12px; background-color: #f9fafb; border-left: 3px solid #3b82f6; border-radius: 4px;">
            <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Message:</div>
            <p style="font-size: 14px; color: #374151; margin: 0; white-space: pre-line;">{{message}}</p>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 16px; font-size: 12px; color: #9ca3af; text-align: center;">
    Sent from the Elyana Reign invitation website.
  </div>
</div>
```

## Notes
- In EmailJS, create a new template and paste the HTML body above.
- Add the variables `name`, `guests`, `attending`, and `message` in the template.
- If you want the email to also show the destination email, you can include `to_email` in the template, but the service already sends to the configured destination.
- Once the template is created, copy its ID into `src/emailConfig.ts`.
