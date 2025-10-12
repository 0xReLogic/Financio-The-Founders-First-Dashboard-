from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query
from appwrite.id import ID
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.exception import AppwriteException
import google.generativeai as genai
import os
import json
from datetime import datetime, timedelta

# Environment variables
DATABASE_ID = os.environ.get("APPWRITE_DATABASE_ID", "financio_db")
TRANSACTIONS_COLLECTION = os.environ.get("APPWRITE_COLLECTION_TRANSACTIONS", "transactions")
CATEGORIES_COLLECTION = os.environ.get("APPWRITE_COLLECTION_CATEGORIES", "categories")
AI_ANALYSES_COLLECTION = os.environ.get("APPWRITE_COLLECTION_AI_ANALYSES", "ai_analyses")
RATE_LIMITS_COLLECTION = os.environ.get("APPWRITE_COLLECTION_RATE_LIMITS", "rate_limits")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Credit-based system config
FREE_TIER_CREDITS = 10  # Free users get 10 lifetime analyses
PAID_TIER_CREDITS = 50  # Paid users get 50 credits (for future SaaS)

def check_rate_limit(databases, user_id):
    """Check if user has available credits (lifetime limit)"""
    try:
        # Get rate limit document (must exist - created by frontend)
        try:
            rate_limit = databases.get_document(
                database_id=DATABASE_ID,
                collection_id=RATE_LIMITS_COLLECTION,
                document_id=user_id
            )
        except Exception as e:
            # If document doesn't exist, user hasn't been initialized
            return False, {
                "error": "Rate limit not initialized. Please refresh the page.",
                "code": "NOT_INITIALIZED"
            }
        
        # Get credit info
        total_credits = rate_limit.get("totalCredits") if "totalCredits" in rate_limit else FREE_TIER_CREDITS
        used_credits = rate_limit.get("usedCredits") if "usedCredits" in rate_limit else 0
        remaining_credits = total_credits - used_credits
        
        # Check if user has credits
        if remaining_credits <= 0:
            return False, {
                "error": "No credits remaining",
                "totalCredits": total_credits,
                "usedCredits": used_credits,
                "remainingCredits": 0,
                "message": "Upgrade to premium to get 50 additional credits!"
            }
        
        # Deduct 1 credit
        databases.update_document(
            database_id=DATABASE_ID,
            collection_id=RATE_LIMITS_COLLECTION,
            document_id=user_id,
            data={
                "usedCredits": used_credits + 1,
                "lastUsedAt": datetime.now().isoformat()
            }
        )
        
        return True, {
            "totalCredits": total_credits,
            "usedCredits": used_credits + 1,
            "remainingCredits": remaining_credits - 1,
            "isPaid": rate_limit.get("isPaid", False)
        }
    except Exception as e:
        return False, {"error": f"Credit check failed: {str(e)}"}

def get_user_transactions(databases, user_id, days=30):
    """Fetch user's recent transactions"""
    try:
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Query transactions
        transactions = databases.list_documents(
            database_id=DATABASE_ID,
            collection_id=TRANSACTIONS_COLLECTION,
            queries=[
                Query.equal("userId", user_id),
                Query.greater_than_equal("date", start_date.isoformat()),
                Query.order_desc("date"),
                Query.limit(100)
            ]
        )
        
        return transactions.get("documents", [])
    except Exception as e:
        raise Exception(f"Failed to fetch transactions: {str(e)}")

def get_categories(databases, user_id):
    """Fetch user's categories"""
    try:
        categories = databases.list_documents(
            database_id=DATABASE_ID,
            collection_id=CATEGORIES_COLLECTION,
            queries=[
                Query.equal("userId", user_id),
                Query.limit(100)
            ]
        )
        
        # Create category lookup map
        category_map = {}
        for cat in categories.get("documents", []):
            category_map[cat["$id"]] = cat["name"]
        
        return category_map
    except Exception as e:
        raise Exception(f"Failed to fetch categories: {str(e)}")

def analyze_transactions(transactions, categories):
    """Analyze transaction patterns"""
    total_income = 0
    total_expense = 0
    expense_by_category = {}
    
    for txn in transactions:
        amount = txn.get("amount", 0)
        txn_type = txn.get("type", "")
        category_id = txn.get("category")  # Field name is "category" not "categoryId"
        category_name = categories.get(category_id, "Unknown")
        
        if txn_type == "income":
            total_income += amount
        elif txn_type == "expense":
            total_expense += amount
            expense_by_category[category_name] = expense_by_category.get(category_name, 0) + amount
    
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": total_income - total_expense,
        "expense_by_category": expense_by_category,
        "transaction_count": len(transactions)
    }

def generate_ai_advice(analysis_data, transactions):
    """Generate AI financial advice using Gemini"""
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Build prompt
        prompt = f"""
You are a financial advisor for Small and Medium Enterprises (SMEs) and startups globally. 
Analyze the following financial data and provide actionable advice in English.

**Financial Summary (Last 30 Days):**
- Total Income: ${analysis_data['total_income']:,.0f}
- Total Expense: ${analysis_data['total_expense']:,.0f}
- Net Balance: ${analysis_data['net_balance']:,.0f}
- Number of Transactions: {analysis_data['transaction_count']}

**Expense Breakdown by Category:**
"""
        for category, amount in sorted(analysis_data['expense_by_category'].items(), key=lambda x: x[1], reverse=True):
            percentage = (amount / analysis_data['total_expense'] * 100) if analysis_data['total_expense'] > 0 else 0
            prompt += f"\n- {category}: ${amount:,.0f} ({percentage:.1f}%)"
        
        prompt += """

**Please provide:**
1. **Financial Analysis**: Provide a brief analysis of the business's financial health.
2. **Areas for Savings**: Identify expense categories that can be optimized.
3. **Recommendations**: Give 3-5 specific, actionable recommendations to improve cash flow and profitability.
4. **Warnings**: Highlight any critical issues (e.g., expenses exceeding income, concerning spending patterns).

Format your response in clear markdown with proper headings and structure for easy readability.
Focus on practical, global business advice applicable to SMEs and startups worldwide.
"""
        
        # Generate advice
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        raise Exception(f"Failed to generate AI advice: {str(e)}")

def save_analysis(databases, user_id, analysis_summary, ai_advice):
    """Save analysis result to database"""
    try:
        # Ensure advice is string and <= 5000 chars
        advice_str = str(ai_advice) if ai_advice is not None else ""
        if len(advice_str) > 5000:
            advice_str = advice_str[:5000]
        analysis = databases.create_document(
            database_id=DATABASE_ID,
            collection_id=AI_ANALYSES_COLLECTION,
            document_id=ID.unique(),
            data={
                "userId": user_id,
                "analysisDate": datetime.now().isoformat(),
                "summary": json.dumps(analysis_summary),
                "advice": advice_str,
                "periodDays": 30
            }
            # No permissions parameter - rely on collection-level permissions
        )
        return analysis
    except Exception as e:
        raise Exception(f"Failed to save analysis: {str(e)}")

def main(context):
    """Main function handler"""
    try:
        # Initialize Appwrite client
        # Note: Appwrite auto-injects these env vars at runtime
        client = (
            Client()
            .set_endpoint(os.environ.get("APPWRITE_FUNCTION_API_ENDPOINT", ""))
            .set_project(os.environ.get("APPWRITE_FUNCTION_PROJECT_ID", ""))
            .set_key(os.environ.get("APPWRITE_API_KEY", ""))
        )
        databases = Databases(client)
        
        # Get user ID from request
        user_id = context.req.body_json.get("userId") if context.req.body else None
        if not user_id:
            return context.res.json({"error": "userId is required"}, 400)
        
        context.log(f"Processing AI analysis for user: {user_id}")
        
        # Debug: Check rate limit document first
        try:
            debug_doc = databases.get_document(DATABASE_ID, RATE_LIMITS_COLLECTION, user_id)
            context.log(f"Rate limit document: {json.dumps(debug_doc)}")
        except Exception as e:
            context.log(f"Failed to get rate limit for debug: {str(e)}")
        
        # Check credits
        allowed, credit_info = check_rate_limit(databases, user_id)
        if not allowed:
            context.log(f"Credit check failed: {json.dumps(credit_info)}")
            return context.res.json({
                **credit_info,
                "code": "NO_CREDITS"
            }, 429)
        
        # Fetch transactions
        context.log("Fetching user transactions...")
        transactions = get_user_transactions(databases, user_id)
        
        if len(transactions) == 0:
            return context.res.json({
                "error": "No transactions found. Please add some transactions first.",
                "code": "NO_TRANSACTIONS"
            }, 400)
        
        # Fetch categories
        context.log("Fetching categories...")
        categories = get_categories(databases, user_id)
        
        # Analyze transactions
        context.log("Analyzing transaction patterns...")
        analysis_summary = analyze_transactions(transactions, categories)
        
        # Generate AI advice
        context.log("Generating AI financial advice...")
        ai_advice = generate_ai_advice(analysis_summary, transactions)
        
        # Save analysis
        context.log("Saving analysis to database...")
        saved_analysis = save_analysis(databases, user_id, analysis_summary, ai_advice)
        
        context.log(f"Analysis completed successfully. ID: {saved_analysis['$id']}")
        
        # Return response
        return context.res.json({
            "success": True,
            "analysisId": saved_analysis["$id"],
            "summary": analysis_summary,
            "advice": ai_advice,
            "credits": credit_info,
            "timestamp": datetime.now().isoformat()
        })
        
    except AppwriteException as e:
        context.error(f"Appwrite error: {repr(e)}")
        return context.res.json({
            "error": f"Database error: {str(e)}",
            "code": "APPWRITE_ERROR"
        }, 500)
    
    except Exception as e:
        context.error(f"Unexpected error: {repr(e)}")
        return context.res.json({
            "error": f"Internal error: {str(e)}",
            "code": "INTERNAL_ERROR"
        }, 500)
