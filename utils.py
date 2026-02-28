import math
import string
import random

def calculate_entropy(password):
    charset = 0
    if any(c.islower() for c in password):
        charset += 26
    if any(c.isupper() for c in password):
        charset += 26
    if any(c.isdigit() for c in password):
        charset += 10
    if any(c in string.punctuation for c in password):
        charset += 32

    if charset == 0:
        return 0

    return round(len(password) * math.log2(charset), 2)

def check_leaked(password):
    with open("leaked_passwords.txt") as f:
        leaked = f.read().splitlines()
    return password.lower() in leaked

def generate_password(length=14):
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(chars) for _ in range(length))