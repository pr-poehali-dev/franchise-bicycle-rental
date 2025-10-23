import json
import os
from typing import Dict, Any
import psycopg2
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Save franchise request to database
    Args: event - dict with httpMethod, body
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    name = body_data.get('name', '')
    phone = body_data.get('phone', '')
    email = body_data.get('email', '')
    message = body_data.get('message', '')
    
    # Connect to database
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    # Insert request
    cur.execute(
        "INSERT INTO t_p91341333_franchise_bicycle_re.franchise_requests (name, phone, email, message) VALUES (%s, %s, %s, %s) RETURNING id",
        (name, phone, email, message)
    )
    request_id = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    
    # Send to Telegram
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if telegram_token and telegram_chat_id:
        telegram_message = f"""🚴 Новая заявка на франшизу!

👤 Имя: {name}
📱 Телефон: {phone}
📧 Email: {email}

💬 Сообщение:
{message}

🆔 ID заявки: {request_id}"""
        
        telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
        requests.post(telegram_url, json={
            'chat_id': telegram_chat_id,
            'text': telegram_message,
            'parse_mode': 'HTML'
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'id': request_id,
            'message': 'Заявка сохранена'
        })
    }