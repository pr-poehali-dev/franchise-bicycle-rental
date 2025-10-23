import json
from typing import Dict, Any
from urllib.parse import quote

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send franchise application via WhatsApp to +79649582528
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict with WhatsApp link
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
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
    
    # Parse request body
    body_data = json.loads(event.get('body', '{}'))
    name = body_data.get('name', '')
    phone = body_data.get('phone', '')
    email = body_data.get('email', '')
    message = body_data.get('message', '')
    
    # Format WhatsApp message
    whatsapp_message = f"""🚴 Новая заявка на франшизу!

👤 Имя: {name}
📱 Телефон: {phone}
📧 Email: {email}

💬 Сообщение:
{message}"""
    
    # Create WhatsApp link
    whatsapp_number = '79649582528'
    encoded_message = quote(whatsapp_message)
    whatsapp_link = f'https://wa.me/{whatsapp_number}?text={encoded_message}'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'whatsapp_link': whatsapp_link,
            'message': 'Заявка сформирована'
        })
    }
