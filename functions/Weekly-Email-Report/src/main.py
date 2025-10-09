from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.messaging import Messaging
from appwrite.services.users import Users
from appwrite.query import Query
from appwrite.id import ID
import os
from datetime import datetime, timedelta

DATABASE_ID = os.environ.get("APPWRITE_DATABASE_ID", "financio_db")
TRANSACTIONS_COLLECTION = os.environ.get("APPWRITE_COLLECTION_TRANSACTIONS", "transactions")
CATEGORIES_COLLECTION = os.environ.get("APPWRITE_COLLECTION_CATEGORIES", "categories")

def generate_html_email(user_name, transactions, income, expense, balance):
    """Generate HTML email template"""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #65a30d 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
            .stats {{ display: flex; justify-content: space-around; margin: 20px 0; }}
            .stat-card {{ background: #f7fee7; padding: 20px; border-radius: 8px; text-align: center; flex: 1; margin: 0 10px; }}
            .stat-value {{ font-size: 24px; font-weight: bold; color: #65a30d; }}
            .stat-label {{ color: #666; font-size: 14px; }}
            .transaction {{ border-bottom: 1px solid #eee; padding: 10px 0; }}
            .footer {{ background: #fafaf9; padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Weekly Financial Report</h1>
                <p>Hello {user_name},</p>
                <p>Here is your financial summary for this week</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-value">${income:,}</div>
                    <div class="stat-label">Total Income</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${expense:,}</div>
                    <div class="stat-label">Total Expense</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${balance:,}</div>
                    <div class="stat-label">Net Balance</div>
                </div>
            </div>
            
            <h3>Recent Transactions ({len(transactions)} transactions)</h3>
            <div class="transactions">
                {''.join([f'<div class="transaction">{t}</div>' for t in transactions[:5]])}
            </div>
            
            <div class="footer">
                <p>This email was sent automatically by Financio</p>
                <p><a href="https://financio.app">Open Dashboard</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return html

def main(context):
    """Weekly email report function"""
    client = Client()
    client.set_endpoint(os.environ.get("APPWRITE_FUNCTION_API_ENDPOINT", os.environ.get("APPWRITE_ENDPOINT")))
    client.set_project(os.environ.get("APPWRITE_FUNCTION_PROJECT_ID", os.environ.get("APPWRITE_PROJECT_ID")))
    client.set_key(os.environ.get("APPWRITE_API_KEY", ""))
    
    databases = Databases(client)
    messaging = Messaging(client)
    users_service = Users(client)
    
    try:
        # Get all users
        users = users_service.list()
        
        # Process each user
        for user in users.get("users", []):
            user_id = user.get("$id")
            user_name = user.get("name", "User")
            user_email = user.get("email")
            
            if not user_email:
                continue
            
            # Get user's transactions from last 7 days
            seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
            
            transactions = databases.list_documents(
                database_id=DATABASE_ID,
                collection_id=TRANSACTIONS_COLLECTION,
                queries=[
                    Query.equal("userId", user_id),
                    Query.greater_than_equal("date", seven_days_ago)
                ]
            )
            
            # Calculate stats
            income = sum(t["amount"] for t in transactions.get("documents", []) if t["type"] == "income")
            expense = sum(t["amount"] for t in transactions.get("documents", []) if t["type"] == "expense")
            balance = income - expense
            
            # Generate email HTML
            html_content = generate_html_email(
                user_name=user_name,
                transactions=[
                    f"{t['description']} - ${t['amount']:,}" 
                    for t in transactions.get("documents", [])
                ],
                income=income,
                expense=expense,
                balance=balance
            )
            
            # Send email via Messaging API
            messaging.create_email(
                message_id=ID.unique(),
                subject=f"📊 Weekly Financial Report - {datetime.now().strftime('%B %d, %Y')}",
                content=html_content,
                users=[user_id],  # Send to specific user
                html=True,
                draft=False
            )
            
            context.log(f"Email sent to {user_email}")
        
        return context.res.json({
            "success": True,
            "message": f"Emails sent to {len(users.get('users', []))} users"
        })
        
    except Exception as e:
        context.error(f"Error sending emails: {str(e)}")
        return context.res.json({
            "success": False,
            "error": str(e)
        }, 500)
