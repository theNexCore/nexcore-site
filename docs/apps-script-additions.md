# Adding tour / membership / office to the Apps Script

The site sends six form types. The script currently handles three:

| Type | Tab | Status |
|---|---|---|
| `contact` | Contact | handled |
| `idea` | Event Ideas | handled |
| `space` | Space Requests | handled |
| `tour` | — | **falls back to Contact** |
| `membership` | — | **falls back to Contact** |
| `office` | — | **falls back to Contact** |
| `daypass` | — | **falls back to Contact** |

Until the three below are added, the site sends the specific type, gets the
unknown-type error back, and automatically retries as `contact` so the lead is
never lost. Once they exist the fallback stops firing on its own — **nothing on
the website needs changing or redeploying.**

---

## ⚠️ Read this before deploying

**Do NOT create a new deployment.** In Apps Script, *Deploy → New deployment*
issues a **new `/exec` URL**, which would break both the events feed and every
form on the site at once.

Use **Deploy → Manage deployments → (pencil icon) → Version: New version →
Deploy**. That keeps the same URL.

---

## Fields the site sends

```
tour        name, email, phone, business, brings
membership  name, email, phone, business, tier
office      name, company, email, phone, office, notes
daypass     name, email, phone, business, date
```

All arrive as JSON in `e.postData.contents`, `Content-Type: text/plain`, with a
`type` field alongside — same shape as `contact`, `idea` and `space`.

---

## Code

Add three cases to the existing `type` switch in `doPost`, then the handlers.
Adjust the helper names to match what `contact` already uses in your script —
the sheet-append and email calls below follow the common pattern.

```javascript
// --- inside doPost's type switch, alongside contact/idea/space ---
case 'tour':       return handleTour(data);
case 'membership': return handleMembership(data);
case 'office':     return handleOffice(data);


function handleTour(d) {
  var sheet = getSheet('Tour Requests', [
    'Timestamp', 'Name', 'Email', 'Phone', 'Business', 'What brings you'
  ]);
  sheet.appendRow([
    new Date(), d.name || '', d.email || '', d.phone || '',
    d.business || '', d.brings || ''
  ]);

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: 'Tour request — ' + (d.name || 'unknown'),
    body: [
      'Name:     ' + (d.name || ''),
      'Email:    ' + (d.email || ''),
      'Phone:    ' + (d.phone || ''),
      'Business: ' + (d.business || ''),
      '',
      'What brings them to NexCore:',
      d.brings || '(not given)'
    ].join('\n')
  });

  return json({ ok: true });
}


function handleMembership(d) {
  var sheet = getSheet('Membership Enquiries', [
    'Timestamp', 'Name', 'Email', 'Phone', 'Business', 'Tier'
  ]);
  sheet.appendRow([
    new Date(), d.name || '', d.email || '', d.phone || '',
    d.business || '', d.tier || ''
  ]);

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: 'Membership enquiry — ' + (d.name || 'unknown'),
    body: [
      'Name:     ' + (d.name || ''),
      'Email:    ' + (d.email || ''),
      'Phone:    ' + (d.phone || ''),
      'Business: ' + (d.business || ''),
      'Tier:     ' + (d.tier || '(not given)'),
      '',
      'Next step is the $50 deposit via Square.'
    ].join('\n')
  });

  return json({ ok: true });
}


function handleOffice(d) {
  var sheet = getSheet('Office Enquiries', [
    'Timestamp', 'Name', 'Company', 'Email', 'Phone', 'Office', 'Notes'
  ]);
  sheet.appendRow([
    new Date(), d.name || '', d.company || '', d.email || '',
    d.phone || '', d.office || '', d.notes || ''
  ]);

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: 'Office enquiry — ' + (d.office || 'unspecified') + ' — ' + (d.name || 'unknown'),
    body: [
      'Name:    ' + (d.name || ''),
      'Company: ' + (d.company || ''),
      'Email:   ' + (d.email || ''),
      'Phone:   ' + (d.phone || ''),
      'Office:  ' + (d.office || '(not specified)'),
      '',
      'Notes:',
      d.notes || '(none)'
    ].join('\n')
  });

  return json({ ok: true });
}


/** Creates the tab with headers on first use. */
function getSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}


/** Match whatever the existing handlers use to return JSON. */
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

`NOTIFY_TO` should be whatever constant the existing handlers already use for
`hello@thenexcore.com`. If they inline the address instead, inline it here too.

---

## Verifying

After deploying the new version, from the project root:

```bash
node -e "
const U='<the /exec URL>';
const t=['tour','membership','office'];
(async()=>{for(const type of t){
  const r=await fetch(U,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify({type,name:'ZZTEST '+type,email:'hello@thenexcore.com'})});
  console.log(type, await r.text());
}})();"
```

Three `{\"ok\":true}` replies means it worked, and the site's fallback stops
firing immediately — no deploy needed.
