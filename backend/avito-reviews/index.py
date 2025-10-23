import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from bs4 import BeautifulSoup

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Парсит отзывы с Авито и сохраняет в БД
    Args: event с httpMethod, queryStringParameters
    Returns: HTTP ответ с отзывами или статусом обновления
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    if method == 'GET':
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT * FROM t_p91341333_franchise_bicycle_re.avito_reviews ORDER BY created_at DESC')
            reviews = cur.fetchall()
        
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps([dict(r) for r in reviews], default=str)
        }
    
    if method == 'POST':
        avito_url = 'https://www.avito.ru/user/2456c6e89dc07e321fdf7e948f223f86/profile'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(avito_url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        reviews_data = []
        review_elements = soup.select('[data-marker="review-item"]')
        
        for review in review_elements[:10]:
            author = review.select_one('[data-marker="review-author"]')
            text = review.select_one('[data-marker="review-text"]')
            rating = review.select_one('[data-marker="review-rating"]')
            
            if author and text:
                reviews_data.append({
                    'author': author.text.strip(),
                    'text': text.text.strip(),
                    'rating': 5 if rating and 'positive' in str(rating) else 4
                })
        
        with conn.cursor() as cur:
            cur.execute('DELETE FROM t_p91341333_franchise_bicycle_re.avito_reviews')
            
            for review in reviews_data:
                cur.execute(
                    'INSERT INTO t_p91341333_franchise_bicycle_re.avito_reviews (author, text, rating) VALUES (%s, %s, %s)',
                    (review['author'], review['text'], review['rating'])
                )
        
        conn.commit()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'count': len(reviews_data)})
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }