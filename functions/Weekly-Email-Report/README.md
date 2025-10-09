# Weekly Email Report Function

## Overview
Automated weekly financial summary emails sent to all Financio users every Monday at 8 AM.

## Features
- 📊 Weekly transaction summary
- 💰 Income vs Expense statistics
- 📈 Net balance calculation
- 📧 HTML email template with responsive design
- ⏰ Automated scheduling via cron trigger

## Configuration

### Environment Variables
Set these in Appwrite Console → Functions → Weekly-Email-Report → Settings:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_DATABASE_ID=financio_db
APPWRITE_COLLECTION_TRANSACTIONS=transactions
APPWRITE_COLLECTION_CATEGORIES=categories
```

### Schedule Trigger
Set cron schedule in Appwrite Console → Functions → Weekly-Email-Report → Settings:

**Cron:** `0 8 * * 1` (Every Monday at 8:00 AM)

### Email Provider
Before deploying this function, configure an email provider:

1. Go to Appwrite Console → Messaging → Providers
2. Click "Add Provider" → Select SMTP provider
3. Recommended providers:
   - **SendGrid** (Free tier: 100 emails/day)
   - **Mailgun** (Free tier: 300 emails/day)
   - **Gmail SMTP** (Free: 500 emails/day)

#### SendGrid Setup Example:
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: <your-sendgrid-api-key>
From Email: noreply@financio.app
From Name: Financio
```

## Deployment

### Using Appwrite CLI
```bash
# Initialize project (if not done)
appwrite init project

# Deploy function
appwrite deploy function

# Set environment variables
appwrite functions updateVariable \
  --functionId <function-id> \
  --key APPWRITE_DATABASE_ID \
  --value financio_db

# Enable schedule
appwrite functions update \
  --functionId <function-id> \
  --schedule "0 8 * * 1"
```

### Using Appwrite Console
1. Go to Functions → Create Function
2. Name: `Weekly-Email-Report`
3. Runtime: `Python 3.12`
4. Entrypoint: `src/main.py`
5. Upload files: `src/main.py`, `requirements.txt`
6. Set environment variables (see above)
7. Set schedule: `0 8 * * 1`
8. Deploy

## Testing

### Manual Test
Trigger the function manually from Appwrite Console:
1. Go to Functions → Weekly-Email-Report → Executions
2. Click "Execute Now"
3. Check execution logs

### Check Email
- Verify email received in user's inbox
- Check spam folder if not visible
- Verify HTML rendering in email client

## Email Template
The function generates a beautiful HTML email with:
- Green gradient header with Financio branding
- Three stat cards: Income, Expense, Balance
- Top 5 recent transactions
- Footer with app link

## Cron Schedule Examples
- Every Monday 8 AM: `0 8 * * 1`
- Every Friday 5 PM: `0 17 * * 5`
- Daily at 9 AM: `0 9 * * *`
- First day of month at 8 AM: `0 8 1 * *`

## Troubleshooting

### Emails not sending
1. Check email provider is configured correctly
2. Verify SMTP credentials in Appwrite Console
3. Check function execution logs for errors
4. Ensure users have valid email addresses

### Function not running on schedule
1. Verify cron syntax in function settings
2. Check function is enabled (not disabled)
3. View execution history in Console

### Permission errors
1. Ensure function has API key with proper scopes
2. Check database permissions allow reading user data
3. Verify Messaging service is enabled

## Dependencies
- `appwrite==5.1.1` - Appwrite Python SDK

## License
MIT
