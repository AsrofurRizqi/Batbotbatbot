import os
from dotenv import load_dotenv
import telebot
import psycopg2
from datetime import datetime

# Load environment variables
load_dotenv()

# Telegram Bot Token
BOT_TOKEN = os.getenv('BOT_TOKEN')
# PostgreSQL credentials
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')

bot = telebot.TeleBot(BOT_TOKEN)

def connect_db():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

# Command handlers
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Welcome to VPN Server Bot!\n"
                         "/buy - Buy VPN server\n"
                         "/topup - Top up your balance\n"
                         "/list - List available servers\n"
                         "/balance - Check your balance")

@bot.message_handler(commands=['buy'])
def buy_vpn(message):
    conn = connect_db()
    cur = conn.cursor()
    try:
        # Check user balance and available servers
        cur.execute("SELECT balance FROM users WHERE telegram_id = %s", (message.from_user.id,))
        user = cur.fetchone()
        if not user:
            bot.reply_to(message, "Please top up your balance first!")
            return
        
        # List available servers
        cur.execute("SELECT id, name, price FROM vpn_servers WHERE available = TRUE")
        servers = cur.fetchall()
        
        if not servers:
            bot.reply_to(message, "No servers available at the moment.")
            return
        
        server_list = "Available servers:\n"
        for server in servers:
            server_list += f"ID: {server[0]} - {server[1]} - ${server[2]}\n"
        
        bot.reply_to(message, server_list + "\nTo buy, use: /buy_server <server_id>")
        
    finally:
        cur.close()
        conn.close()

@bot.message_handler(commands=['topup'])
def topup_balance(message):
    bot.reply_to(message, "To top up your balance, please send the amount:\n"
                         "Format: /topup_amount <amount>")

@bot.message_handler(commands=['list'])
def list_servers(message):
    conn = connect_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT name, price, status FROM vpn_servers")
        servers = cur.fetchall()
        
        if not servers:
            bot.reply_to(message, "No servers available.")
            return
        
        server_list = "Available VPN Servers:\n"
        for server in servers:
            server_list += f"📍 {server[0]} - ${server[1]} - Status: {server[2]}\n"
        
        bot.reply_to(message, server_list)
        
    finally:
        cur.close()
        conn.close()

@bot.message_handler(commands=['balance'])
def check_balance(message):
    conn = connect_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT balance FROM users WHERE telegram_id = %s", (message.from_user.id,))
        user = cur.fetchone()
        
        if user:
            bot.reply_to(message, f"Your current balance: ${user[0]}")
        else:
            bot.reply_to(message, "You don't have an account yet. Please top up first.")
            
    finally:
        cur.close()
        conn.close()

# Start the bot
if __name__ == "__main__":
    bot.polling(none_stop=True)